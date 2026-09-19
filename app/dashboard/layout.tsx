import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Vue d'ensemble" },
  { href: "/dashboard/crm", label: "Prospects & clients" },
  { href: "/dashboard/content", label: "Contenu & réseaux" },
  { href: "/dashboard/approvals", label: "À approuver" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full">
      <aside className="w-56 shrink-0 border-r border-black/10 p-4 dark:border-white/10">
        <div className="mb-6 px-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Assistant — Pilotage
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
