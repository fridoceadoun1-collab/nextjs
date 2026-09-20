import type { Product } from "./catalog";

/**
 * Creates a FedaPay payment link for a product using the REST API directly
 * (no SDK dependency). Requires FEDAPAY_SECRET_KEY; returns null when it's
 * not configured so callers can fall back to a human handling the payment.
 *
 * NOTE: verify this request/response shape against FedaPay's current API
 * reference (https://docs.fedapay.com) before relying on it in production —
 * this hasn't been exercised against a real account yet. FedaPay amounts are
 * whole numbers in the currency's base unit (no cents for XOF/GNF).
 */
export async function createPaymentLink(
  product: Product,
  customerEmail?: string,
  customerName?: string
): Promise<string | null> {
  const secretKey = process.env.FEDAPAY_SECRET_KEY;
  if (!secretKey) return null;

  const apiBase =
    process.env.FEDAPAY_ENV === "live"
      ? "https://api.fedapay.com/v1"
      : "https://sandbox-api.fedapay.com/v1";
  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const [firstname, ...rest] = (customerName ?? "Client").split(" ");

  const createResponse = await fetch(`${apiBase}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: product.name,
      amount: Math.round(product.price),
      currency: { iso: product.currency },
      callback_url: `${siteUrl}/boutique/merci`,
      customer: {
        firstname,
        lastname: rest.join(" ") || "—",
        email: customerEmail,
      },
    }),
  });

  if (!createResponse.ok) {
    console.error("FedaPay transaction creation failed", await createResponse.text());
    return null;
  }

  const created = (await createResponse.json()) as { ["v1/transaction"]?: { id?: number } };
  const transactionId = created["v1/transaction"]?.id;
  if (!transactionId) return null;

  const tokenResponse = await fetch(`${apiBase}/transactions/${transactionId}/token`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  if (!tokenResponse.ok) {
    console.error("FedaPay token generation failed", await tokenResponse.text());
    return null;
  }

  const token = (await tokenResponse.json()) as { url?: string };
  return token.url ?? null;
}
