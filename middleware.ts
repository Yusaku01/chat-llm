import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple Basic Auth middleware, based on the official Next.js docs
export function middleware(req: NextRequest) {
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // If credentials are not set, skip auth (useful for local dev)
  if (!username || !password) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const [user, pass] = decoded.split(":");
        if (user === username && pass === password) {
          return NextResponse.next();
        }
      } catch {
        // fallthrough to 401 below
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      // Triggers the browser login dialog
      "WWW-Authenticate": 'Basic realm="Protected"',
    },
  });
}

// Exclude common static/public assets from auth checks
export const config = {
  matcher: [
    
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

