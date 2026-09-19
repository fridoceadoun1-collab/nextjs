export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  promo?: string;
}

// TODO: replace with the real catalog from the client's shop (API, CMS, or
// database) once it is connected. Kept in code for now so the storefront and
// the assistant's promotion queue have real-looking data to work with.
export const products: Product[] = [
  {
    id: "audit-strategie",
    name: "Audit stratégie & croissance",
    description: "Un diagnostic complet de votre présence commerciale et digitale, avec un plan d'action priorisé.",
    price: 249,
    currency: "EUR",
  },
  {
    id: "accompagnement-mensuel",
    name: "Accompagnement mensuel",
    description: "Suivi mensuel pour développer votre clientèle et optimiser vos offres.",
    price: 490,
    currency: "EUR",
    promo: "-15% le premier mois",
  },
  {
    id: "pack-lancement",
    name: "Pack lancement",
    description: "Tout ce qu'il faut pour lancer une nouvelle offre : positionnement, contenus, plan de prospection.",
    price: 890,
    currency: "EUR",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
