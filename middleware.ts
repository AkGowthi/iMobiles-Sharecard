import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const hostname = req.headers.get("host") || "";
    const path = req.nextUrl.pathname;
    const isLoggedIn = !!req.auth;

    // Check for login subdomains (production and local)
    const isLoginSubdomain =
        hostname === "login.sharecard.co.in" ||
        hostname === "login.localhost:3000";

    // Rewrite the root of the login subdomain to the /login page
    if (isLoginSubdomain && path === "/") {
        console.log(`Middleware: Rewriting subdomain ${hostname} root to /login`);
        return NextResponse.rewrite(new URL("/login", req.url));
    }

    const isOnCreateCard = path.startsWith('/create-card');

    console.log(`Middleware: ${path} | Host: ${hostname} | LoggedIn: ${isLoggedIn}`);

    if (isOnCreateCard && !isLoggedIn) {
        console.log("Middleware: Redirecting unauthenticated user from create-card to login");
        return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
