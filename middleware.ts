import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    const hostname = req.headers.get("host") || "";
    const path = req.nextUrl.pathname;

    // Check for login subdomains (production and local)
    const isLoginSubdomain =
        hostname === "login.sharecard.co.in" ||
        hostname === "login.localhost:3000";

    // Rewrite the root of the login subdomain to the /login page
    if (isLoginSubdomain && path === "/") {
        console.log(`Middleware: Rewriting subdomain ${hostname} root to /login`);
        return NextResponse.rewrite(new URL("/login", req.url));
    }

    // Completely bypass NextAuth Edge container initializations for pure static frontend demonstrations
    // This entirely resolves x-vercel-error: MIDDLEWARE_INVOCATION_FAILED on Edge networks lacking backend oauth secrets
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
