import { listPosts } from "@/lib/store";
import { products } from "@/lib/catalog";
import { addPostAction } from "./actions";
import PublishButton from "./PublishButton";

const PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
] as const;

const STATUS_LABEL: Record<string, string> = {
  brouillon: "Brouillon",
  planifie: "Planifié",
  publie: "Publié",
  echec: "Échec",
};

export default async function ContentPage() {
  const posts = await listPosts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Contenu & réseaux sociaux</h1>

      <form action={addPostAction} className="mb-10 flex flex-col gap-3 rounded-xl border border-black/10 p-5 dark:border-white/10">
        <input name="title" placeholder="Titre du post" required className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <textarea name="body" placeholder="Contenu du post" required rows={3} className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <select name="productRef" className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10">
          <option value="">— Aucun produit lié —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="flex gap-4 text-sm">
          {PLATFORMS.map((p) => (
            <label key={p.value} className="flex items-center gap-2">
              <input type="checkbox" name="platforms" value={p.value} />
              {p.label}
            </label>
          ))}
        </div>
        <input type="datetime-local" name="scheduledFor" className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
        <button type="submit" className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background">
          Ajouter à la file
        </button>
      </form>

      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <p className="mt-1 text-sm text-zinc-500">{post.body}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {post.platforms.join(", ")} · {STATUS_LABEL[post.status]}
                  {post.scheduledFor && ` · prévu le ${new Date(post.scheduledFor).toLocaleString("fr-FR")}`}
                </p>
                {post.publishResult && <p className="mt-1 text-xs text-zinc-400">{post.publishResult}</p>}
              </div>
              {post.status !== "publie" && <PublishButton id={post.id} />}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-zinc-500">Aucun contenu planifié pour l&apos;instant.</p>
        )}
      </div>
    </div>
  );
}
