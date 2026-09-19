import { products } from "@/lib/catalog";

export default function BoutiquePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold">Boutique</h1>
      <p className="mb-10 text-zinc-600 dark:text-zinc-400">
        Discutez avec l&apos;assistant en bas à droite pour être orienté vers la bonne offre.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.id} className="rounded-xl border border-black/10 p-6 dark:border-white/10">
            <h2 className="text-lg font-medium">{product.name}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{product.description}</p>
            <p className="mt-4 text-base font-semibold">
              {product.price} {product.currency}
            </p>
            {product.promo && <p className="mt-1 text-sm text-emerald-600">{product.promo}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
