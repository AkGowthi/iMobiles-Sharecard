"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[320px] rounded-2xl p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-center">
                        Are you sure you want to Log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="hidden">
                        This action will sign you out of your account.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3 sm:justify-center mt-4">
                    <AlertDialogCancel className="mt-0 flex-1 rounded-full h-10 border-none bg-gray-200 hover:bg-gray-300 text-black font-semibold">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        className="flex-1 rounded-full h-10 bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        Log out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
