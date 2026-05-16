"use client";

import { useFormContext } from "react-hook-form";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const THEME_PRESETS = [
    { name: "Neutral White", bg: "#FFFFFF", btn: "#1B54E0" },
    { name: "Pastel Green", bg: "#F0FDF4", btn: "#166534" },
    { name: "Pastel Pink", bg: "#FDF2F8", btn: "#9D174D" },
    { name: "Pastel Violet", bg: "#F5F3FF", btn: "#5B21B6" },
    { name: "Pastel Yellow", bg: "#FFFBEB", btn: "#92400E" },
    { name: "Light Gray", bg: "#FAFAFA", btn: "#1F2937" },
];

export function ThemeSection() {
    const { register, watch, setValue } = useFormContext();
    const currentBg = watch("theme_color");

    const handleSelect = (bg: string, btn: string) => {
        setValue("theme_color", bg, { shouldDirty: true, shouldTouch: true });
        setValue("button_color", btn, { shouldDirty: true, shouldTouch: true });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {THEME_PRESETS.map((theme) => (
                    <button
                        key={theme.name}
                        type="button"
                        onClick={() => handleSelect(theme.bg, theme.btn)}
                        className={cn(
                            "relative group flex flex-col items-center justify-between p-4 rounded-xl transition-all hover:shadow-md h-32 w-full",
                            currentBg === theme.bg
                                ? "border-black dark:border-white ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-black"
                                : "border-transparent hover:border-gray-200 dark:hover:border-zinc-800"
                        )}
                        style={{ backgroundColor: theme.bg }}
                    >
                        {/* Selected Indicator */}
                        {currentBg === theme.bg && (
                            <div className="absolute top-2 right-2 bg-black dark:bg-white text-white dark:text-black rounded-full p-0.5">
                                <Check className="w-3 h-3" />
                            </div>
                        )}

                        {/* Preview Elements */}
                        <div className="w-full flex flex-col gap-2 items-center mt-2">
                            <div className="w-16 h-2 rounded-full bg-black/10 dark:bg-black/5" />
                            <div className="w-10 h-2 rounded-full bg-black/5 dark:bg-black/5" />
                        </div>

                        {/* Button Preview */}
                        <div
                            className="w-full h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white shadow-sm mt-auto"
                            style={{ backgroundColor: theme.btn }}
                        >
                            Button
                        </div>
                    </button>
                ))}
            </div>
            <input type="hidden" {...register("theme_color")} />
            <input type="hidden" {...register("button_color")} />
        </div>
    );
}
