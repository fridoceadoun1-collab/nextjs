import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Mon Entreprise
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/">Accueil</Link>
          <Link href="/boutique">Boutique</Link>
        </nav>
      </div>
    </header>
  );
}
