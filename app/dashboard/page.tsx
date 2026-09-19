import { listEscalations, listPosts, listProspects } from "@/lib/store";

export default async function DashboardOverview() {
  const [prospects, posts, escalations] = await Promise.all([
    listProspects(),
    listPosts(),
    listEscalations(),
  ]);

  const pendingEscalations = escalations.filter((e) => e.status === "en_attente");
  const hotProspects = prospects.filter((p) => p.status === "hesitant" || p.status === "a_relancer");

  const stats = [
    { label: "Prospects & clients", value: prospects.length },
    { label: "À relancer / hésitants", value: hotProspects.length },
    { label: "Posts planifiés", value: posts.filter((p) => p.status === "planifie").length },
    { label: "En attente d'approbation", value: pendingEscalations.length },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Vue d&apos;ensemble</h1>
      <div className="grid gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-black/10 p-5 dark:border-white/10">
            <div className="text-3xl font-semibold">{stat.value}</div>
            <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {pendingEscalations.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold">Dernières demandes en attente</h2>
          <ul className="space-y-2">
            {pendingEscalations.slice(0, 5).map((e) => (
              <li key={e.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
                <span className="font-medium">{e.summary}</span>
                <p className="mt-1 text-zinc-500">{e.details}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
