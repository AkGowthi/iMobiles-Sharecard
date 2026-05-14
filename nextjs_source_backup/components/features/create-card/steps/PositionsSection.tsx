"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PositionsSection() {
    const { register, control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "positions"
    });

    const addPosition = () => {
        if (fields.length < 5) {
            append({ title: "", org: "" });
        }
    };

    return (
        <div className="space-y-4">
            <AnimatePresence>
                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-800/50"
                    >
                        <div className="space-y-2">
                            <Label>Position Title</Label>
                            <Input
                                {...register(`positions.${index}.title` as const)}
                                placeholder="e.g. Your Position"
                            />
                            {(errors.positions as any)?.[index]?.title && (
                                <p className="text-red-500 text-xs">{(errors.positions as any)[index]?.title?.message as string}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Organization</Label>
                            <div className="flex gap-2">
                                <Input
                                    {...register(`positions.${index}.org` as const)}
                                    placeholder="e.g. Organization Name"
                                    className="flex-1"
                                />
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Position?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this position.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => remove(index)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            {(errors.positions as any)?.[index]?.org && (
                                <p className="text-red-500 text-xs">{(errors.positions as any)[index]?.org?.message as string}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {fields.length < 5 && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={addPosition}
                    className="cursor-pointer"
                >
                    + Add Position
                </Button>
            )}
        </div>
    );
}
