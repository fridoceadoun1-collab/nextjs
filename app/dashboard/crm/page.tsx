import { listProspects } from "@/lib/store";
import { addProspectAction } from "./actions";
import StatusSelect from "./StatusSelect";

export default async function CrmPage() {
  const prospects = await listProspects();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Prospects & clients</h1>

      <form action={addProspectAction} className="mb-10 grid gap-3 rounded-xl border border-black/10 p-5 sm:grid-cols-2 dark:border-white/10">
        <input name="name" placeholder="Nom" required className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <input name="email" placeholder="Email" className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <input name="phone" placeholder="Téléphone" className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <input name="interest" placeholder="Intérêt / offre" className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <button type="submit" className="sm:col-span-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
          Ajouter un prospect
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 text-zinc-500 dark:border-white/10">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Intérêt</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Dernière note</th>
            </tr>
          </thead>
          <tbody>
            {prospects.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-zinc-500">{p.email ?? p.phone ?? "—"}</td>
                <td className="px-4 py-3">{p.interest ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-500">{p.source}</td>
                <td className="px-4 py-3">
                  <StatusSelect id={p.id} status={p.status} />
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-zinc-500">
                  {p.notes.at(-1) ?? "—"}
                </td>
              </tr>
            ))}
            {prospects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                  Aucun prospect pour l&apos;instant — l&apos;assistant en ajoutera automatiquement via le chat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
