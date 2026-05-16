import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            // Defer protection to middleware.ts
            return true;
        },
    },
    pages: {
        signIn: '/login',
    },
} satisfies NextAuthConfig
