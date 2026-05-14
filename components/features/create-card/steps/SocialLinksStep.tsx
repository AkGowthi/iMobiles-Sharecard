import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Globe, Instagram, Linkedin, Youtube, Facebook, Link as LinkIcon } from "lucide-react";
import { FaWhatsapp, FaBehance, FaXTwitter, FaThreads } from "react-icons/fa6";
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

// Map ID to Icon
const socialTypes = [
    { id: 1, name: "WhatsApp", icon: <FaWhatsapp className="w-4 h-4 text-green-500" /> },
    { id: 2, name: "Instagram", icon: <Instagram className="w-4 h-4 text-pink-500" /> },
    { id: 3, name: "Website", icon: <Globe className="w-4 h-4 text-gray-500" /> },
    { id: 4, name: "LinkedIn", icon: <Linkedin className="w-4 h-4 text-blue-600" /> },
    { id: 5, name: "YouTube", icon: <Youtube className="w-4 h-4 text-red-600" /> },
    { id: 6, name: "Facebook", icon: <Facebook className="w-4 h-4 text-blue-500" /> },
    { id: 7, name: "Threads", icon: <FaThreads className="w-4 h-4 text-black dark:text-white" /> },
    { id: 8, name: "Behance", icon: <FaBehance className="w-4 h-4 text-blue-700" /> },
];

export function SocialLinksStep() {
    const { register, control, watch, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "social_links"
    });

    const watchedFields = watch("social_links");

    return (
        <div className="space-y-4">


            {fields.map((field, index) => {
                const currentTypeId = watchedFields?.[index]?.type_id || (field as any).type_id;

                return (
                    <div key={field.id} className="flex flex-col md:flex-row gap-4 items-start border p-4 rounded-md bg-card relative">
                        <div className="w-full md:w-[180px] space-y-2">
                            <Label>Platform</Label>
                            <Controller
                                control={control}
                                name={`social_links.${index}.type_id`}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        value={value?.toString()}
                                        onValueChange={(val) => onChange(Number(val))}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialTypes.map(type => {
                                                const isSelectedElsewhere = watchedFields?.some((field: any, i: number) =>
                                                    i !== index && Number(field.type_id) === type.id
                                                );

                                                return (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={type.id.toString()}
                                                        disabled={isSelectedElsewhere}
                                                        className={isSelectedElsewhere ? "opacity-50 cursor-not-allowed" : ""}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {type.icon}
                                                            <span>{type.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="w-full md:flex-[2] space-y-2">
                            <Label>
                                {Number(currentTypeId) === 1 ? "Number" : "Link"} <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex items-center rounded-md border border-input focus-within:border-[#1b54e0] focus-within:border-2 transition-all">
                                {/* Prefix */}
                                <div className="bg-muted px-3 h-9 flex items-center rounded-l-[5px] border-r border-input text-sm text-muted-foreground whitespace-nowrap">
                                    {Number(currentTypeId) === 1 ? "+91" : "https://"}
                                </div>

                                {/* Input */}
                                <Input
                                    {...register(`social_links.${index}.link`)}
                                    className="rounded-l-none border-0 shadow-none focus-visible:ring-0 focus-visible:border-0 h-9 flex-1"
                                    placeholder={
                                        Number(currentTypeId) === 1
                                            ? "Enter 10-digit mobile number"
                                            : socialTypes.find(t => t.id === Number(currentTypeId))?.name === "Instagram"
                                                ? "instagram.com/username"
                                                : socialTypes.find(t => t.id === Number(currentTypeId))?.name === "LinkedIn"
                                                    ? "linkedin.com/in/username"
                                                    : socialTypes.find(t => t.id === Number(currentTypeId))?.name === "Threads"
                                                        ? "threads.net/@username"
                                                        : socialTypes.find(t => t.id === Number(currentTypeId))?.name === "YouTube"
                                                            ? "youtube.com/@channel"
                                                            : socialTypes.find(t => t.id === Number(currentTypeId))?.name === "Facebook"
                                                                ? "facebook.com/username"
                                                                : "example.com"
                                    }
                                />
                            </div>

                            {(errors.social_links as any)?.[index]?.link && (
                                <p className="text-red-500 text-sm">
                                    {Number(currentTypeId) === 1 ? "Number is required" : "Link is required"}
                                </p>
                            )}
                        </div>

                        <div className="absolute top-2 right-2 md:static md:space-y-2 md:mt-0">
                            <Label className="invisible hidden md:block">Del</Label>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 cursor-pointer text-gray-500 hover:text-red-500 md:bg-transparent hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete this social link.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => remove(index)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                );
            })}

            {fields.length < socialTypes.length && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        const usedIds = new Set(watchedFields?.map((f: any) => Number(f.type_id)) || []);
                        const nextAvailable = socialTypes.find(t => !usedIds.has(t.id));
                        append({ type_id: nextAvailable ? nextAvailable.id : 1, link: "" });
                    }}
                    className="cursor-pointer"
                >
                    + Add Social Link
                </Button>
            )}
        </div>
    );
}
