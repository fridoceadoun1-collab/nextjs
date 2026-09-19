import type { Product } from "./catalog";

/**
 * Creates a Stripe Checkout link for a product using the REST API directly
 * (no SDK dependency). Requires STRIPE_SECRET_KEY; returns null when it's not
 * configured so callers can fall back to a human handling the payment.
 */
export async function createPaymentLink(
  product: Product,
  customerEmail?: string
): Promise<string | null> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${siteUrl}/boutique/merci`);
  body.set("cancel_url", `${siteUrl}/boutique`);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", product.currency.toLowerCase());
  body.set("line_items[0][price_data][unit_amount]", String(Math.round(product.price * 100)));
  body.set("line_items[0][price_data][product_data][name]", product.name);
  if (customerEmail) body.set("customer_email", customerEmail);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    console.error("Stripe checkout session creation failed", await response.text());
    return null;
  }

  const session = (await response.json()) as { url?: string };
  return session.url ?? null;
}
