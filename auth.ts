import NextAuth from "next-auth"
import SequelizeAdapter from "@auth/sequelize-adapter"
import sequelize from "./lib/db"
import { DataTypes } from "sequelize"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { syncDatabase } from "@/lib/models" // Import custom models sync function
import { authConfig } from "./auth.config"
import type { NextAuthConfig } from "next-auth" // Import NextAuthConfig type

// NextAuth v5 often relies on the Host header if trustHost is true.
// However, if the production Nginx/Apache reverse proxy does not forward the Host header
// (e.g. proxy_set_header Host $host is missing), the callback URL will incorrectly use localhost:3000.
// We prioritize the environment variable if present.
if (!process.env.AUTH_URL && process.env.NEXT_PUBLIC_APP_URL) {
    process.env.AUTH_URL = process.env.NEXT_PUBLIC_APP_URL;
}
const defaultAuthUrl = process.env.AUTH_URL || (process.env.NODE_ENV === "production" ? "https://sharecard.co.in" : "http://localhost:3000");


// Validate required environment variables
if (!process.env.AUTH_SECRET) {
    console.error("❌ AUTH_SECRET is missing! This is required for NextAuth.");
    throw new Error("AUTH_SECRET environment variable is required");
}

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    console.error("❌ Google OAuth credentials are missing!");
    throw new Error("AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET are required");
}

console.log("✅ NextAuth Configuration:");
console.log("   Default AUTH_URL:", defaultAuthUrl);
console.log("   AUTH_SECRET:", process.env.AUTH_SECRET ? "✓ Set" : "✗ Missing");
console.log("   AUTH_GOOGLE_ID:", process.env.AUTH_GOOGLE_ID ? "✓ Set" : "✗ Missing");

// Ensure custom models are synced after adapter initializes
syncDatabase();

// Initialize adapter first - let it create its own models
// Then we'll update the table names to match our schema
let adapter;
try {
    adapter = SequelizeAdapter(sequelize);
    console.log("✅ NextAuth Sequelize adapter initialized successfully");

    // Test database connection (non-blocking, for logging only)
    sequelize.authenticate()
        .then(() => {
            console.log("✅ Database connection verified");
        })
        .catch((dbError: any) => {
            console.warn("⚠️ Database connection check failed (will retry on first use):", dbError.message);
        });

    // Update the adapter's models to use the correct table names from our schema
    // Tables already exist, we just need to point the models to the right table names
    const UserModel = sequelize.models.User || sequelize.models.user;
    const AccountModel = sequelize.models.Account || sequelize.models.account;
    const SessionModel = sequelize.models.Session || sequelize.models.session;
    const VerificationTokenModel = sequelize.models.VerificationToken || sequelize.models.verificationToken;

    if (UserModel) {
        (UserModel as any).tableName = 'Users';
        (UserModel as any).options.tableName = 'Users';
        (UserModel as any).options.freezeTableName = true;

    }

    if (AccountModel) {
        (AccountModel as any).tableName = 'Accounts';
        (AccountModel as any).options.tableName = 'Accounts';
        (AccountModel as any).options.freezeTableName = true;
    }

    if (SessionModel) {
        (SessionModel as any).tableName = 'Sessions';
        (SessionModel as any).options.tableName = 'Sessions';
        (SessionModel as any).options.freezeTableName = true;
    }

    if (VerificationTokenModel) {
        (VerificationTokenModel as any).tableName = 'VerificationTokens';
        (VerificationTokenModel as any).options.tableName = 'VerificationTokens';
        (VerificationTokenModel as any).options.freezeTableName = true;
    }

    // Override sync methods to prevent syncing tables that already exist
    [UserModel, AccountModel, SessionModel, VerificationTokenModel].forEach(model => {
        if (model) {
            (model as any).sync = async function (options?: any) {
                // Tables already exist from schema.sql, skip syncing
                return this;
            };
        }
    });
} catch (error: any) {
    console.error("❌ Failed to initialize NextAuth adapter:", error);
    console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
    });
    throw new Error(`NextAuth adapter initialization failed: ${error.message}`);
}

// Get the User model for use in callbacks
const UserModel = sequelize.models.User || sequelize.models.user;

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter,
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Crucial for subdomain support and proxying
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) return null;

                    const UserModel = sequelize.models.User || sequelize.models.user;
                    if (!UserModel) return null;

                    const dbUser = await UserModel.findOne({
                        where: { email: credentials.username as string }
                    }) as any;

                    if (!dbUser || !dbUser.password) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        dbUser.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    if (dbUser.isBanned || dbUser.is_banned) {
                        return null;
                    }

                    return {
                        id: dbUser.id,
                        email: dbUser.email,
                        name: dbUser.name,
                        isAdmin: dbUser.isAdmin || dbUser.is_admin || false,
                    };
                } catch (error) {
                    console.error("Credentials Authorization Error:", error);
                    return null;
                }
            }
        })
    ],
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".sharecard.co.in" : undefined,
                secure: process.env.NODE_ENV === "production",
            },
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".sharecard.co.in" : undefined,
                secure: process.env.NODE_ENV === "production",
            },
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".sharecard.co.in" : undefined,
                secure: process.env.NODE_ENV === "production",
            },
        },
        pkceCodeVerifier: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".sharecard.co.in" : undefined,
                secure: process.env.NODE_ENV === "production",
            },
        },
        state: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                domain: process.env.NODE_ENV === "production" ? ".sharecard.co.in" : undefined,
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            console.log("NextAuth Redirect Callback:", { url, baseUrl });

            // If the URL is relative, prepend the baseUrl
            if (url.startsWith("/")) {
                const target = `${baseUrl}${url}`;
                console.log("NextAuth Redirect: Relative ->", target);
                return target;
            }

            // Allow redirects to the same base domain
            try {
                const urlObj = new URL(url);
                if (urlObj.origin.endsWith("sharecard.co.in") || urlObj.origin.endsWith("localhost:3000")) {
                    console.log("NextAuth Redirect: Allowed Origin ->", url);
                    return url;
                }
            } catch (e) {
                console.error("NextAuth Redirect: Invalid URL ->", url);
            }

            console.log("NextAuth Redirect: Fallback to baseUrl ->", baseUrl);
            return baseUrl;
        },
        async signIn({ user }) {
            try {
                if (!user.email) return true; // Should ideally check, but for now allow strict email checks later or assume provider is good.

                // Direct DB check for most up-to-date status
                const UserModel = sequelize.models.User || sequelize.models.user;
                if (!UserModel) {
                    console.warn("User model not found in signIn callback");
                    return true;
                }

                const dbUser = await UserModel.findOne({
                    where: { email: user.email }
                }) as any;

                // Access is_banned column (adapter uses snake_case in DB, camelCase in model)
                // Try both naming conventions to be safe
                if (dbUser && (dbUser.isBanned || dbUser.is_banned)) {
                    return "/banned"; // Redirect to banned page
                }

                return true;
            } catch (error) {
                console.error("Error checking ban status:", error);
                return true; // Fail open or closed? Fail open to avoid lockouts on error? Better fail open for now or investigate.
            }
        },
        async jwt({ token, user }) {
            // When user first signs in, pass properties to token
            if (user) {
                token.id = user.id;
                token.isAdmin = (user as any).isAdmin;
            }

            if (token.sub) {
                try {
                    const UserModel = sequelize.models.User || sequelize.models.user;
                    if (!UserModel) return token;

                    const dbUser = await UserModel.findByPk(token.sub) as any;
                    // Access is_banned column (adapter uses snake_case in DB, camelCase in model)
                    if (dbUser && (dbUser.isBanned || dbUser.is_banned)) {
                        token.isBanned = true;
                    }
                    if (dbUser && (dbUser.isAdmin || dbUser.is_admin)) {
                        token.isAdmin = true;
                    }
                } catch (e) {
                    console.error("Error in jwt database check", e);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.isBanned) {
                // If user is banned, invalidate session. 
                return {} as any;
            }
            if (session.user) {
                if (token.sub) session.user.id = token.sub;
                if (token.id) session.user.id = token.id as string;
                (session.user as any).isAdmin = token.isAdmin || false;
            }
            return session;
        }
    }
} satisfies NextAuthConfig) // Add 'satisfies NextAuthConfig' to ensure proper typing
