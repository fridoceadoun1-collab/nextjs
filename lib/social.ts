import { updatePostStatus } from "./store";
import { notifyEscalation } from "./notify";
import type { ContentPost } from "./types";

/**
 * Publishes/schedules a post through Metricool so it goes out to the
 * configured Facebook/Instagram/LinkedIn accounts.
 *
 * NOTE: verify this request shape against Metricool's current API reference
 * (https://app.metricool.com/api) before relying on it in production — the
 * exact payload can change and this hasn't been exercised against a live
 * account. Until METRICOOL_* env vars are set, this intentionally falls back
 * to flagging the post for a human to publish by hand.
 */
export async function publishToSocial(post: ContentPost): Promise<void> {
  const token = process.env.METRICOOL_API_TOKEN;
  const userId = process.env.METRICOOL_USER_ID;
  const blogId = process.env.METRICOOL_BLOG_ID;

  if (!token || !userId || !blogId) {
    await notifyEscalation({
      kind: "besoin_humain",
      summary: `Publication "${post.title}" à faire manuellement`,
      details:
        "Metricool n'est pas encore configuré (METRICOOL_API_TOKEN/USER_ID/BLOG_ID manquants). " +
        `Contenu à publier sur ${post.platforms.join(", ")} :\n\n${post.body}`,
    });
    await updatePostStatus(post.id, "echec", "Metricool non configuré — publication manuelle requise");
    return;
  }

  try {
    const response = await fetch(
      `https://app.metricool.com/api/v2/scheduler/posts?userToken=${encodeURIComponent(token)}&userId=${userId}&blogId=${blogId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: post.body,
          providers: post.platforms.map((platform) => ({ network: platform })),
          publicationDate: post.scheduledFor ?? new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Metricool a répondu ${response.status}: ${await response.text()}`);
    }

    await updatePostStatus(post.id, "publie", "Envoyé à Metricool");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updatePostStatus(post.id, "echec", message);
    await notifyEscalation({
      kind: "besoin_humain",
      summary: `Échec de publication automatique pour "${post.title}"`,
      details: message,
    });
  }
}
