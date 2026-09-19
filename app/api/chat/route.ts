import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  draftReply,
  findMentionedProduct,
  wantsHuman,
  wantsToBuy,
  type ChatMessage,
} from "@/lib/chat-brain";
import { createPaymentLink } from "@/lib/payment";
import { notifyEscalation } from "@/lib/notify";
import { createProspect, getProspectBySession, updateProspect } from "@/lib/store";

interface ChatRequestBody {
  sessionId: string;
  message: string;
  history: ChatMessage[];
  contact?: { name?: string; email?: string };
}

function reply(payload: { reply?: string; error?: string }, init?: { status: number }) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/crm");
  return NextResponse.json(payload, init);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequestBody;
  const { sessionId, message, history, contact } = body;

  if (!sessionId || !message) {
    return NextResponse.json({ error: "sessionId et message sont requis" }, { status: 400 });
  }

  let prospect = await getProspectBySession(sessionId);
  if (!prospect) {
    prospect = await createProspect({
      name: contact?.name ?? "Visiteur du site",
      email: contact?.email,
      source: "chatbot",
      chatSessionId: sessionId,
      note: `Premier message : "${message}"`,
    });
  } else if (contact?.email && contact.email !== prospect.email) {
    await updateProspect(prospect.id, { email: contact.email });
  }

  if (wantsHuman(message)) {
    await notifyEscalation({
      kind: "besoin_humain",
      summary: `${prospect.name} souhaite parler à un humain`,
      details: message,
      prospectId: prospect.id,
    });
    await updateProspect(prospect.id, {
      status: "a_relancer",
      addNote: "A demandé à parler à un humain.",
      touchContact: true,
    });
    return reply({
      reply: "Bien sûr, je transmets votre demande à un membre de l'équipe qui vous recontactera très vite.",
    });
  }

  const mentionedProduct = findMentionedProduct(message);

  if (wantsToBuy(message) && mentionedProduct) {
    const paymentLink = await createPaymentLink(mentionedProduct, contact?.email);
    await updateProspect(prospect.id, {
      status: "client",
      interest: mentionedProduct.name,
      addNote: `Intéressé par un achat : ${mentionedProduct.name}`,
      touchContact: true,
    });

    if (paymentLink) {
      return reply({
        reply: `Parfait ! Voici votre lien de paiement sécurisé pour "${mentionedProduct.name}" : ${paymentLink}`,
      });
    }

    await notifyEscalation({
      kind: "paiement",
      summary: `${prospect.name} veut acheter "${mentionedProduct.name}"`,
      details: "Le paiement en ligne n'est pas encore configuré (STRIPE_SECRET_KEY manquant) : envoyez le lien manuellement.",
      prospectId: prospect.id,
    });
    return reply({
      reply: "Excellent choix ! Un membre de l'équipe va vous envoyer le lien de paiement dans quelques instants.",
    });
  }

  const assistantReply = await draftReply([...history, { role: "user", content: message }]);
  await updateProspect(prospect.id, { touchContact: true, status: prospect.status === "nouveau" ? "hesitant" : prospect.status });

  return reply({ reply: assistantReply });
}
