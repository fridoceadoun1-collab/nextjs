This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Ce que contient ce projet

Un site vitrine + boutique, et un back-office ("assistant commercial virtuel") pour le piloter :

- `/` et `/boutique` — le site public, avec un chatbot (bouton "💬 Discuter" en bas à droite).
- `/dashboard` — back-office protégé par mot de passe :
  - **Vue d'ensemble** — statistiques rapides.
  - **Prospects & clients** — CRM simple (ajout manuel, mise à jour de statut, historique).
  - **Contenu & réseaux** — file de posts à publier sur Facebook/Instagram/LinkedIn via Metricool.
  - **À approuver** — les demandes du chatbot qui nécessitent un humain (relance, idée business, paiement à confirmer).

## Ce qui est réellement branché vs. ce qui reste à faire

| Fonctionnalité | État |
| --- | --- |
| Qualification de prospects par chat + CRM | ✅ fonctionnel dès maintenant |
| File de contenu à publier | ✅ fonctionnel dès maintenant |
| Escalade humaine (dashboard) | ✅ fonctionnel dès maintenant |
| Réponses du chatbot via Claude | ⚙️ optionnel — ajoutez `ANTHROPIC_API_KEY`, sinon réponses simples par défaut |
| Notification Slack / email | ⚙️ optionnel — ajoutez `SLACK_WEBHOOK_URL` et/ou `RESEND_API_KEY` |
| Lien de paiement (FedaPay) | ⚙️ optionnel — ajoutez `FEDAPAY_SECRET_KEY`, sinon l'assistant transmet la demande à un humain. **Vérifiez le format exact de la requête dans la doc FedaPay actuelle avant mise en prod** (voir `lib/payment.ts`) |
| Publication automatique sur les réseaux (Metricool) | ⚙️ optionnel — ajoutez `METRICOOL_API_TOKEN`/`METRICOOL_USER_ID`/`METRICOOL_BLOG_ID`. **Vérifiez le format exact de la requête dans la doc Metricool actuelle avant mise en prod** (voir `lib/social.ts`) |
| Navigation web autonome, prospection active sur les réseaux, closing 100% automatique | ❌ non implémenté — nécessite des comptes business réels, des accès API avancés et des garde-fous supplémentaires ; à cadrer dans une itération suivante |

Le catalogue produit (`lib/catalog.ts`) est encore une donnée d'exemple : à remplacer par la vraie boutique une fois connectée.

Le stockage (`lib/store.ts`) est un fichier JSON local (`data/db.json`, ignoré par git) — pratique pour démarrer, mais à remplacer par une vraie base (ex. Supabase) avant un déploiement serverless (Vercel), où le système de fichiers n'est pas persistant entre les requêtes.

## Configuration

Copiez `.env.example` en `.env.local` et renseignez les clés dont vous avez besoin. `DASHBOARD_USER`/`DASHBOARD_PASSWORD` doivent être définis avant tout déploiement public.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
