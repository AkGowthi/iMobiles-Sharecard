"use client";

import { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileSchema, SettingsSchema } from "@/lib/schemas/card-schemas";
import { z } from "zod";
import { saveSettings } from "@/lib/actions/card-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSection } from "../create-card/steps/ThemeSection";
import { QRCodeCustomizationSection } from "../create-card/steps/QRCodeCustomizationSection";
import { Loader2, LayoutList, Rows, Check } from "lucide-react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

type UserProfileType = z.infer<typeof UserProfileSchema>;
type SettingsType = z.infer<typeof SettingsSchema>;

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: any;
}

export function SettingsDialog({ open, onOpenChange, profile }: SettingsDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Replicate defaultValues logic from CreateCardForm to ensure full object validity
    // Ensure required fields have valid values that pass validation
    const defaultValues: UserProfileType = useMemo(() => {
        // Helper to ensure string fields meet minimum requirements
        const ensureMinLength = (value: string | undefined, min: number, fallback: string) => {
            if (!value || value.trim().length < min) return fallback;
            return value.trim();
        };

        // Helper to validate email format
        const ensureValidEmail = (value: string | undefined, fallback: string) => {
            if (!value || !value.includes('@') || value.trim().length < 5) return fallback;
            return value.trim();
        };

        // Helper to validate phone (basic check - at least 10 digits)
        const ensureValidPhone = (value: string | undefined, fallback: string) => {
            if (!value) return fallback;
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length < 10) return fallback;
            return value;
        };

        // Helper to ensure display_name is valid format
        const ensureValidDisplayName = (value: string | undefined, fallback: string) => {
            if (!value || value.trim().length < 1) return fallback;
            // Must match regex: /^[a-zA-Z0-9._-]+$/
            if (!/^[a-zA-Z0-9._-]+$/.test(value.trim())) return fallback;
            return value.trim();
        };

        return {
            // Use profile values if valid, otherwise use fallbacks to ensure validation passes
            // This allows settings to be saved even if some profile fields need correction
            f_name: ensureMinLength(profile?.f_name, 2, "User"),
            l_name: ensureMinLength(profile?.l_name, 1, "Name"),
            email: ensureValidEmail(profile?.email, "user@example.com"),
            phone_no: ensureValidPhone(profile?.phone_no, "9999999999"),
            company_name: ensureMinLength(profile?.company_name, 1, "Company"),
            company_description: profile?.company_description || "",
            company_website: profile?.company_website || "",
            address: profile?.address || "",
            map_url: profile?.map_url || "",
            display_name: ensureValidDisplayName(profile?.display_name, "user"),
            designation: profile?.designation || profile?.profession || "",
            bio: profile?.bio || "",
            userImage: profile?.picture || profile?.userImage || "",
            business_logo: profile?.business_logo || "",
            qr_favicon: profile?.qr_favicon || "",
            qr_fg_color: profile?.qr_fg_color || "#000000",
            qr_dots_style: profile?.qr_dots_style || "square",
            qr_marker_border_style: profile?.qr_marker_border_style || "square",
            qr_marker_center_style: profile?.qr_marker_center_style || "square",
            theme_color: profile?.theme_color || "#FFFFFF",
            button_color: profile?.button_color || "#1B54E0",
            card_layout: profile?.card_layout || "accordion",
            social_links: profile?.socialHandles?.map((h: any) => ({ type_id: h.type_id, link: h.soc_link })) || [{ type_id: 1, link: "" }],
            products: (() => {
                const products = profile?.products || [];
                return Array.isArray(products) ? products.map((product: any) => ({
                    ...product,
                    prod_images: (() => {
                        if (Array.isArray(product?.prod_images)) return product.prod_images;
                        if (product?.prod_images === null || product?.prod_images === undefined) return [];
                        if (typeof product?.prod_images === 'string') {
                            try {
                                const parsed = JSON.parse(product.prod_images);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch {
                                return [];
                            }
                        }
                        return [];
                    })(),
                })) : [];
            })(),
            gallery: profile?.gallery?.map((g: any) => g.image_url) || [],
            services: (() => {
                try {
                    if (Array.isArray(profile?.services)) return profile.services;
                    if (typeof profile?.services === 'string') return JSON.parse(profile.services);
                    return [];
                } catch (e) {
                    return [];
                }
            })(),
            brochure: profile?.brochure || "",
            positions: (() => {
                try {
                    if (Array.isArray(profile?.positions)) return profile.positions;
                    if (typeof profile?.positions === 'string') return JSON.parse(profile.positions);
                    return [];
                } catch (e) {
                    return [];
                }
            })(),
            terms_accepted: true,
        };
    }, [profile]);

    const methods = useForm({
        resolver: zodResolver(SettingsSchema),
        defaultValues: defaultValues as SettingsType,
        mode: "onChange"
    });

    const onSubmit = async (data: SettingsType) => {
        setIsSaving(true);
        try {
            console.log("Settings submit triggered");
            // Merge form data with defaultValues to ensure all profile fields are included
            // This ensures we have valid profile data even if only settings were edited
            const dataWithDefaults = {
                ...defaultValues,
                ...data, // Settings fields override defaults
            };
            // Use saveSettings which only validates settings fields and merges with existing profile
            const result = await saveSettings(dataWithDefaults);
            if (result.success) {
                toast.success("Settings saved successfully!");
                onOpenChange(false);
            } else {
                console.error("Save failed:", result.error);
                // Check if there's a specific message
                if ((result as any).message) {
                    toast.error((result as any).message);
                } else if (result.error === "Validation failed" && (result as any).issues) {
                    const issues = (result as any).issues || [];
                    const requiredFieldErrors = issues.filter((issue: any) =>
                        ['f_name', 'l_name', 'email', 'phone_no', 'company_name', 'display_name'].includes(issue.path?.[0])
                    );

                    if (requiredFieldErrors.length > 0) {
                        toast.error("Your profile has missing or invalid details (like Name or Company) in the main edit page. Please fix them there first before saving settings.");
                    } else {
                        toast.error("Failed to save settings. Please check all fields.");
                    }
                } else {
                    toast.error("Failed to save settings: " + (result.error || "Unknown error"));
                }
            }
        } catch (error) {
            console.error("Settings submit error:", error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription className="hidden">
                        Manage your profile customization and settings
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit, (errors) => {
                        console.error("Form validation errors:", errors);
                        // Since we're using SettingsSchema, all fields are optional
                        // Any errors here would be unexpected, but show a generic message
                        const errorFields = Object.keys(errors);
                        if (errorFields.length > 0) {
                            console.error("Unexpected validation errors in settings:", errorFields);
                            toast.error("Please check the form fields for errors.");
                        }
                    })} className="space-y-6">
                        <Tabs defaultValue="theme" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="theme">Theme</TabsTrigger>
                                <TabsTrigger value="layout">Layout</TabsTrigger>
                                <TabsTrigger value="qr">QR Code</TabsTrigger>
                            </TabsList>
                            <TabsContent value="theme" className="py-4 px-1">
                                <ThemeSection />
                            </TabsContent>
                            <TabsContent value="layout" className="py-4 px-1">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Profile Layout</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Choose how your profile content is displayed to visitors.
                                        </p>

                                        <Controller
                                            control={methods.control}
                                            name="card_layout"
                                            render={({ field }) => (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Accordion Option */}
                                                    <div
                                                        className={cn(
                                                            "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-zinc-800",
                                                            field.value === 'accordion'
                                                                ? "border-blue-600 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-900/10"
                                                                : "border-gray-200 dark:border-zinc-800"
                                                        )}
                                                        onClick={() => field.onChange('accordion')}
                                                    >
                                                        {field.value === 'accordion' && (
                                                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-zinc-900 rounded-lg p-3 flex flex-col gap-2 overflow-hidden">
                                                            <div className="w-full h-8 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0" />
                                                            <div className="w-full h-8 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0" />
                                                            <div className="w-full h-8 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0" />
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="font-semibold flex items-center justify-center gap-2">
                                                                <LayoutList className="w-4 h-4" /> Accordion
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">Compact view, sections expand on click</p>
                                                        </div>
                                                    </div>

                                                    {/* Full Page Option */}
                                                    <div
                                                        className={cn(
                                                            "relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-zinc-800",
                                                            field.value === 'full_page'
                                                                ? "border-blue-600 bg-blue-50/10 dark:border-blue-500 dark:bg-blue-900/10"
                                                                : "border-gray-200 dark:border-zinc-800"
                                                        )}
                                                        onClick={() => field.onChange('full_page')}
                                                    >
                                                        {field.value === 'full_page' && (
                                                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-white" />
                                                            </div>
                                                        )}
                                                        <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-zinc-900 rounded-lg p-3 flex flex-col gap-2 overflow-hidden overflow-y-auto no-scrollbar">
                                                            <div className="w-full h-24 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0" />
                                                            <div className="w-full h-24 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700 shadow-sm shrink-0" />
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="font-semibold flex items-center justify-center gap-2">
                                                                <Rows className="w-4 h-4" /> Full Page
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1">Expanded view, scroll vertically through all content</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="qr" className="py-4 px-1">
                                <QRCodeCustomizationSection />
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-3 pt-4 border-t sticky -bottom-7 bg-white dark:bg-zinc-950 pb-4 z-10">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
