"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

function LoginContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const host = window.location.hostname;
            setIsAdminSubdomain(host.startsWith("login."));
        }
    }, []);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                username: email,
                password: password,
                redirect: false,
            });

            if (result?.error) {
                console.error("Login Error:", result.error);
                alert("Invalid credentials. Please try again.");
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            console.error("Unexpected error during login:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        signIn("google");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
            <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
                {/* Logo */}
                <div className="mb-4">
                    <Image
                        src="/ShareCard Logo.svg"
                        alt="ShareCard"
                        width={180}
                        height={50}
                        className="h-10 w-auto"
                        style={{ width: 'auto' }}
                        priority
                    />
                </div>

                <div className="w-full text-center mb-6">
                    {/* <h1 className="text-2xl font-bold text-slate-900">Login</h1> */}
                    <p className="text-slate-500 text-sm mt-1">
                        {isAdminSubdomain
                            ? "Enter your credentials to access the Admin Panel."
                            : "Welcome!"}
                    </p>
                </div>

                {isAdminSubdomain ? (
                    /* Credentials Form for Admin Subdomain */
                    <form onSubmit={handleCredentialsLogin} className="w-full flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email or Username</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                                required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 px-4 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 border-none bg-slate-900 text-white font-bold rounded-xl mt-2 transition-all hover:bg-slate-800 disabled:opacity-50 active:scale-[0.98] cursor-pointer flex items-center justify-center"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Login"}
                        </button>

                        <p className="mt-8 text-center text-[11px] text-slate-400 font-medium uppercase tracking-[0.1em]">
                            ShareCard Admin Panel
                        </p>
                    </form>
                ) : (
                    /* Google Login only for main site */
                    <div className="w-full flex flex-col items-center">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            className="w-full h-14 relative flex items-center justify-center transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer border-none bg-transparent"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="animate-spin text-slate-900" size={24} />
                            ) : (
                                <Image
                                    src="/GSigninLogo.svg"
                                    alt="Sign in with Google"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
                <Loader2 className="animate-spin text-slate-900" size={40} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
