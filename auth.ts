import NextAuth from "next-auth"
import SequelizeAdapter from "@auth/sequelize-adapter"
import sequelize from "./lib/db"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { syncDatabase } from "@/lib/models" // Import custom models sync function
import type { NextAuthConfig } from "next-auth" // Import NextAuthConfig type

interface SequelizeOverride {
    tableName?: string;
    options?: {
        tableName?: string;
        freezeTableName?: boolean;
    };
    sync?: (_options?: unknown) => Promise<unknown>;
}

interface DBUserOverride {
    id: string;
    email: string;
    name: string;
    password?: string;
    isAdmin?: boolean;
    is_admin?: boolean;
    isBanned?: boolean;
    is_banned?: boolean;
}

// NextAuth v5 often relies on the Host header if trustHost is true.
// However, if the production Nginx/Apache reverse proxy does not forward the Host header
// (e.g. proxy_set_header Host $host is missing), the callback URL will incorrectly use localhost:3000.
// We prioritize the environment variable if present.
if (!process.env.AUTH_URL && process.env.NEXT_PUBLIC_APP_URL) {
    process.env.AUTH_URL = process.env.NEXT_PUBLIC_APP_URL;
}
const defaultAuthUrl = process.env.AUTH_URL || (process.env.NODE_ENV === "production" ? "https://sharecard.co.in" : "http://localhost:3000");


// Supply safe fallbacks for Vercel static build data collection phase
if (!process.env.AUTH_SECRET) {
    console.warn("⚠️ AUTH_SECRET is missing! Defaulting to static build dummy secret.");
    process.env.AUTH_SECRET = "fallback_secret_for_static_builds_only_32_chars_long_secure_token";
}

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    console.warn("⚠️ Google OAuth credentials are missing! Defaulting to static placeholders.");
    process.env.AUTH_GOOGLE_ID = "dummy_google_id_static_build";
    process.env.AUTH_GOOGLE_SECRET = "dummy_google_secret_static_build";
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
        .catch((dbError: unknown) => {
            console.warn("⚠️ Database connection check failed (will retry on first use):", (dbError as Error).message);
        });

    // Update the adapter's models to use the correct table names from our schema
    // Tables already exist, we just need to point the models to the right table names
    const UserModel = sequelize.models.User || sequelize.models.user;
    const AccountModel = sequelize.models.Account || sequelize.models.account;
    const SessionModel = sequelize.models.Session || sequelize.models.session;
    const VerificationTokenModel = sequelize.models.VerificationToken || sequelize.models.verificationToken;

    if (UserModel) {
        const u = UserModel as unknown as SequelizeOverride;
        u.tableName = 'Users';
        if (u.options) {
            u.options.tableName = 'Users';
            u.options.freezeTableName = true;
        }
    }

    if (AccountModel) {
        const a = AccountModel as unknown as SequelizeOverride;
        a.tableName = 'Accounts';
        if (a.options) {
            a.options.tableName = 'Accounts';
            a.options.freezeTableName = true;
        }
    }

    if (SessionModel) {
        const s = SessionModel as unknown as SequelizeOverride;
        s.tableName = 'Sessions';
        if (s.options) {
            s.options.tableName = 'Sessions';
            s.options.freezeTableName = true;
        }
    }

    if (VerificationTokenModel) {
        const v = VerificationTokenModel as unknown as SequelizeOverride;
        v.tableName = 'VerificationTokens';
        if (v.options) {
            v.options.tableName = 'VerificationTokens';
            v.options.freezeTableName = true;
        }
    }

    // Override sync methods to prevent syncing tables that already exist
    [UserModel, AccountModel, SessionModel, VerificationTokenModel].forEach(model => {
        if (model) {
            const m = model as unknown as SequelizeOverride;
            m.sync = async function (_options?: unknown) {
                // Tables already exist from schema.sql, skip syncing
                return this;
            };
        }
    });
} catch (error: unknown) {
    const err = error as Error;
    console.error("❌ Failed to initialize NextAuth adapter:", err);
    console.error("Error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name
    });
    throw new Error(`NextAuth adapter initialization failed: ${err.message}`);
}

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

                    const LocalUserModel = sequelize.models.User || sequelize.models.user;
                    if (!LocalUserModel) return null;

                    const dbUser = await LocalUserModel.findOne({
                        where: { email: credentials.username as string }
                    }) as unknown as DBUserOverride | null;

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
            } catch (_e) {
                console.error("NextAuth Redirect: Invalid URL ->", url);
            }

            console.log("NextAuth Redirect: Fallback to baseUrl ->", baseUrl);
            return baseUrl;
        },
        async signIn({ user }) {
            try {
                if (!user.email) return true;

                // Direct DB check for most up-to-date status
                const LocalUserModel = sequelize.models.User || sequelize.models.user;
                if (!LocalUserModel) {
                    console.warn("User model not found in signIn callback");
                    return true;
                }

                const dbUser = await LocalUserModel.findOne({
                    where: { email: user.email }
                }) as unknown as DBUserOverride | null;

                if (dbUser && (dbUser.isBanned || dbUser.is_banned)) {
                    return "/banned"; // Redirect to banned page
                }

                return true;
            } catch (error) {
                console.error("Error checking ban status:", error);
                return true;
            }
        },
        async jwt({ token, user }) {
            const t = token as unknown as { id?: string; isAdmin?: boolean; isBanned?: boolean; sub?: string; };
            // When user first signs in, pass properties to token
            if (user) {
                t.id = user.id;
                t.isAdmin = (user as unknown as { isAdmin?: boolean }).isAdmin;
            }

            if (t.sub) {
                try {
                    const LocalUserModel = sequelize.models.User || sequelize.models.user;
                    if (!LocalUserModel) return token;

                    const dbUser = await LocalUserModel.findByPk(t.sub) as unknown as DBUserOverride | null;
                    if (dbUser && (dbUser.isBanned || dbUser.is_banned)) {
                        t.isBanned = true;
                    }
                    if (dbUser && (dbUser.isAdmin || dbUser.is_admin)) {
                        t.isAdmin = true;
                    }
                } catch (_e) {
                    console.error("Error in jwt database check", _e);
                }
            }
            return token;
        },
        async session({ session, token }) {
            const tOverride = token as unknown as { isBanned?: boolean; sub?: string; id?: string; isAdmin?: boolean };
            if (tOverride.isBanned) {
                // If user is banned, invalidate session. 
                return {} as unknown as typeof session;
            }
            if (session.user) {
                if (tOverride.sub) session.user.id = tOverride.sub;
                if (tOverride.id) session.user.id = tOverride.id;
                const uOverride = session.user as unknown as { isAdmin?: boolean };
                uOverride.isAdmin = tOverride.isAdmin || false;
            }
            return session;
        }
    }
} satisfies NextAuthConfig)
