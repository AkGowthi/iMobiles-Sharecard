import { ScannerInterface } from "@/components/features/scanner/ScannerInterface";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ScanPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            <div className="w-full max-w-md">
                <ScannerInterface />
            </div>
        </div>
    );
}
