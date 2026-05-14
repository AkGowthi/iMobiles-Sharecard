
"use client";

import { Loader2 } from "lucide-react";

interface GlobalLoaderProps {
    isVisible: boolean;
    text?: string;
}

export function GlobalLoader({ isVisible, text = "Loading..." }: GlobalLoaderProps) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">{text}</p>
            </div>
        </div>
    );
}
