import { revalidatePath } from "next/cache";
import { createEscalation } from "./store";
import type { EscalationKind } from "./types";

async function notifySlack(text: string): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (error) {
    console.error("Slack notification failed", error);
  }
}

async function notifyEmail(subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !to || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });
  } catch (error) {
    console.error("Email notification failed", error);
  }
}

/**
 * Every time the assistant needs a human — a client wants a person, or it has
 * a business/marketing idea to submit — this is the single entry point:
 * it always queues the item in the dashboard, and best-effort pings
 * Slack/email if those channels are configured.
 */
export async function notifyEscalation(input: {
  kind: EscalationKind;
  summary: string;
  details: string;
  prospectId?: string;
}) {
  const escalation = await createEscalation(input);

  const kindLabel: Record<EscalationKind, string> = {
    besoin_humain: "Un prospect/client veut parler à un humain",
    idee_business: "Nouvelle idée business/marketing à valider",
    paiement: "Paiement à confirmer",
  };

  const message = `🔔 ${kindLabel[input.kind]}\n${input.summary}\n\n${input.details}`;

  await Promise.all([
    notifySlack(message),
    notifyEmail(`[Assistant] ${kindLabel[input.kind]}`, message),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/approvals");

  return escalation;
}
