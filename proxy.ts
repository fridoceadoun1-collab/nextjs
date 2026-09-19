import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protects the /dashboard back-office with HTTP Basic Auth. Set
// DASHBOARD_USER / DASHBOARD_PASSWORD before deploying — without them the
// dashboard (CRM, approval queue) would otherwise be open to anyone.
export function proxy(request: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const password = process.env.DASHBOARD_PASSWORD;

  if (!user || !password) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const expected = `Basic ${Buffer.from(`${user}:${password}`).toString("base64")}`;

  if (authHeader === expected) {
    return NextResponse.next();
  }

  return new NextResponse("Authentification requise", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Dashboard"' },
  });
}

export const config = {
  matcher: "/dashboard/:path*",
};
