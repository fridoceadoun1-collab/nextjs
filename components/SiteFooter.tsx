export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-6 py-8 text-center text-sm text-zinc-500 dark:border-white/10">
      © {new Date().getFullYear()} Mon Entreprise. Tous droits réservés.
    </footer>
  );
}
