import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";

export default function BannedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="rounded-full bg-red-100 p-6 mb-6">
                <Ban className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Account Suspended</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                Your account has been suspended for violating our terms of service.
                If you believe this is a mistake, please contact support.
            </p>
            <Button asChild>
                <Link href="/login">Return to Login</Link>
            </Button>
        </div>
    );
}
