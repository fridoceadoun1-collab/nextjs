import { listEscalations } from "@/lib/store";
import EscalationActions from "./EscalationActions";

const KIND_LABEL: Record<string, string> = {
  besoin_humain: "Demande d'un humain",
  idee_business: "Idée business/marketing",
  paiement: "Paiement à traiter",
};

export default async function ApprovalsPage() {
  const escalations = await listEscalations();
  const pending = escalations.filter((e) => e.status === "en_attente");
  const resolved = escalations.filter((e) => e.status !== "en_attente");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">À approuver</h1>

      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">En attente ({pending.length})</h2>
        <div className="space-y-4">
          {pending.map((e) => (
            <div key={e.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium dark:bg-white/10">
                {KIND_LABEL[e.kind]}
              </span>
              <p className="mt-2 font-medium">{e.summary}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-500">{e.details}</p>
              <EscalationActions id={e.id} />
            </div>
          ))}
          {pending.length === 0 && <p className="text-zinc-500">Rien en attente pour le moment.</p>}
        </div>
      </section>

      {resolved.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Historique</h2>
          <div className="space-y-2">
            {resolved.slice(0, 20).map((e) => (
              <div key={e.id} className="rounded-lg border border-black/5 p-3 text-sm dark:border-white/5">
                <span className="font-medium">{e.summary}</span>{" "}
                <span className={e.status === "approuve" ? "text-emerald-600" : "text-red-600"}>
                  ({e.status === "approuve" ? "approuvé" : "rejeté"})
                </span>
                {e.resolutionNote && <p className="mt-1 text-zinc-500">{e.resolutionNote}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
