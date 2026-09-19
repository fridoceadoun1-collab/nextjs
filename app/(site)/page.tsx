import Link from "next/link";
import { products } from "@/lib/catalog";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <section className="flex flex-col items-start gap-6 text-left">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight">
          On développe votre clientèle, pendant que vous vous occupez de votre métier.
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Un assistant commercial disponible en continu pour répondre à vos prospects,
          suivre vos clients et vous prévenir dès qu&apos;une décision humaine est nécessaire.
        </p>
        <Link
          href="/boutique"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
        >
          Voir nos offres
        </Link>
      </section>

      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-semibold">Offres du moment</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-black/10 p-5 dark:border-white/10"
            >
              <h3 className="font-medium">{product.name}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{product.description}</p>
              <p className="mt-3 text-sm font-semibold">
                {product.price} {product.currency}
                {product.promo && <span className="ml-2 text-xs font-normal text-emerald-600">{product.promo}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
