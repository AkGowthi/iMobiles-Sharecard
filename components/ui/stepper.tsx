
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full py-4">
            <div className="relative flex items-center justify-between w-full">
                {/* Connecting Lines Layer */}
                <div className="absolute top-[15px] left-0 w-full h-[2px] bg-gray-200 dark:bg-zinc-800 z-0" />
                <div
                    className="absolute top-[15px] left-0 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-in-out z-0"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center group relative cursor-default">
                            {/* Circle Indicator */}
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-white dark:bg-zinc-950 z-10",
                                    isActive && "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black scale-110",
                                    isCompleted && "border-black bg-white text-black dark:border-white dark:bg-zinc-950 dark:text-white",
                                    isPending && "border-gray-300 text-gray-300 dark:border-zinc-700 dark:text-zinc-700"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : isActive ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-black" />
                                ) : (
                                    <div className="w-2.5 h-2.5 rounded-full bg-transparent" />
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "absolute top-10 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                                    isActive && "text-black dark:text-white font-bold",
                                    isCompleted && "text-gray-900 dark:text-gray-100",
                                    isPending && "text-gray-400 dark:text-zinc-600"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-8" />
        </div>
    );
}
