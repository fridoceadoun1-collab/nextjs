import { products, type Product } from "./catalog";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const HUMAN_KEYWORDS = [
  "humain",
  "conseiller",
  "quelqu'un",
  "responsable",
  "parler à une personne",
  "vrai personne",
];

const BUY_KEYWORDS = ["acheter", "commander", "je prends", "je veux payer", "réserver", "souscrire"];

export function wantsHuman(message: string): boolean {
  const lower = message.toLowerCase();
  return HUMAN_KEYWORDS.some((kw) => lower.includes(kw));
}

export function wantsToBuy(message: string): boolean {
  const lower = message.toLowerCase();
  return BUY_KEYWORDS.some((kw) => lower.includes(kw));
}

export function findMentionedProduct(message: string): Product | undefined {
  const lower = message.toLowerCase();
  return products.find(
    (p) => lower.includes(p.name.toLowerCase()) || lower.includes(p.id.replace(/-/g, " "))
  );
}

function catalogSummary(): string {
  return products
    .map((p) => `- ${p.name} (${p.price} ${p.currency})${p.promo ? ` — ${p.promo}` : ""}: ${p.description}`)
    .join("\n");
}

const SYSTEM_PROMPT = `Tu es l'assistant commercial virtuel de l'entreprise. Tu réponds en français, de façon chaleureuse, concise et orientée conversion.
Ton rôle : comprendre le besoin du visiteur, présenter l'offre la plus pertinente parmi le catalogue ci-dessous, répondre aux objections, et proposer une prochaine étape claire (achat ou rendez-vous).
Si tu ne peux pas répondre ou que la demande sort du cadre commercial, dis que tu transmets à un humain.

Catalogue :
${catalogSummary()}`;

/**
 * Generates a reply. Uses Claude if ANTHROPIC_API_KEY is set; otherwise falls
 * back to a simple templated response so the widget still works out of the box.
 */
export async function draftReply(history: ChatMessage[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackReply(history[history.length - 1]?.content ?? "");
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) throw new Error(`Anthropic API ${response.status}`);
    const data = (await response.json()) as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((block) => block.type === "text")?.text;
    return text ?? fallbackReply(history[history.length - 1]?.content ?? "");
  } catch (error) {
    console.error("draftReply: Anthropic call failed, using fallback", error);
    return fallbackReply(history[history.length - 1]?.content ?? "");
  }
}

function fallbackReply(lastMessage: string): string {
  const product = findMentionedProduct(lastMessage);
  if (product) {
    return `${product.name} coûte ${product.price} ${product.currency}${
      product.promo ? ` (${product.promo})` : ""
    }. ${product.description}\n\nSouhaitez-vous que je vous envoie un lien de paiement, ou préférez-vous qu'un membre de l'équipe vous rappelle ?`;
  }
  return (
    "Merci pour votre message ! Pouvez-vous me préciser ce que vous recherchez : " +
    "un audit, un accompagnement mensuel, ou le lancement d'une nouvelle offre ? " +
    "Je peux aussi vous mettre en relation avec un membre de l'équipe si vous préférez."
  );
}
