import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import CreateCardForm from "@/components/features/create-card/CreateCardForm";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, MoveLeft } from "lucide-react";

import { getUserProfile } from "@/lib/data/user-data";

export default async function CreateCardPage() {
    console.log("CreateCardPage rendering...");
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/api/auth/signin");
    }

    // Fetch existing profile data to pre-fill the form
    let initialData = null;
    try {
        const profile = await getUserProfile(session.user.email);
        if (profile) {
            initialData = profile;
        }
    } catch (error) {
        console.error("Error fetching initial profile data:", error);
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950/50">
            <div className="container mx-auto py-6 max-w-3xl px-4">
                {/* Header Row with Back, Logo, and Logout */}
                <div className="flex items-center justify-between px-4">
                    {/* Back Button - Left */}
                    {initialData?.display_name && (
                        <Link
                            href={`/${initialData.display_name}`}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Back</span>
                        </Link>
                    )}

                    {/* ShareCard Logo - Center */}
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <Image
                            src="/ShareCard Logo.svg"
                            alt="ShareCard - NFC Visiting Cards"
                            width={160}
                            height={40}
                            priority
                            className="w-auto h-8 md:h-10"
                        />
                    </Link>

                    {/* Logout Button - Right */}
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer">
                            Logout
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto pb-10 max-w-3xl px-4">
                <div>
                    <CreateCardForm initialData={initialData} />
                </div>
            </div>
        </div>
    );
}
