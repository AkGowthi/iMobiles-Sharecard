"use client";

import { useState, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserProfileSchema } from "@/lib/schemas/card-schemas";
import { z } from "zod";
import { saveProfile } from "@/lib/actions/card-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft, Building2, Briefcase, Wrench, Package, Image as ImageIcon, FileText, Share2, Calendar } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep";
import { SocialLinksStep } from "./steps/SocialLinksStep";
import { ProductsHeader } from "./ProductsHeader";
import { GalleryStep } from "./steps/GalleryStep";
import { ServicesSection } from "./steps/ServicesSection";
import { PositionsSection } from "./steps/PositionsSection";

import { BrochureUpload } from "@/components/ui/brochure-upload";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GlobalLoader } from "@/components/ui/global-loader";

type UserProfileType = z.infer<typeof UserProfileSchema>;

export default function CreateCardForm({ initialData }: { initialData?: any }) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const defaultValues: UserProfileType = useMemo(() => ({
        f_name: initialData?.f_name || "",
        l_name: initialData?.l_name || "",
        email: initialData?.email || "",
        phone_no: initialData?.phone_no || "",
        company_name: initialData?.company_name || "",
        company_description: initialData?.company_description || "",
        company_website: initialData?.company_website || "",
        address: initialData?.address || "",
        map_url: initialData?.map_url || "",
        display_name: initialData?.display_name || "",
        designation: initialData?.designation || initialData?.profession || "",
        bio: initialData?.bio || "",
        userImage: initialData?.picture || initialData?.userImage || "",
        business_logo: initialData?.business_logo || "",
        qr_favicon: initialData?.qr_favicon || "",
        qr_fg_color: initialData?.qr_fg_color || "#000000",
        qr_dots_style: initialData?.qr_dots_style || "square",
        qr_marker_border_style: initialData?.qr_marker_border_style || "square",
        qr_marker_center_style: initialData?.qr_marker_center_style || "square",
        theme_color: initialData?.theme_color || "#FFFFFF",
        button_color: initialData?.button_color || "#1B54E0",
        card_layout: initialData?.card_layout || "accordion",
        terms_accepted: initialData?.terms_accepted || false,
        social_links: (Array.isArray(initialData?.socialHandles) ? initialData.socialHandles : []).map((h: any) => ({ type_id: h.type_id, link: h.soc_link })) || [{ type_id: 1, link: "" }],

        products: (() => {
            const products = initialData?.products || [];
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
        gallery: (Array.isArray(initialData?.gallery) ? initialData.gallery : []).map((g: any) => g.image_url) || [],

        services: (() => {
            try {
                if (Array.isArray(initialData?.services)) return initialData.services;
                if (typeof initialData?.services === 'string') return JSON.parse(initialData.services);
                return [];
            } catch (e) {
                return [];
            }
        })(),
        brochure: initialData?.brochure || "",
        positions: (() => {
            try {
                if (Array.isArray(initialData?.positions)) return initialData.positions;
                if (typeof initialData?.positions === 'string') return JSON.parse(initialData.positions);
                return [];
            } catch (e) {
                return [];
            }
        })(),
        booking_url: initialData?.booking_url || "",
    }), [initialData]);

    const methods = useForm({
        resolver: zodResolver(UserProfileSchema),
        mode: "onBlur",
        defaultValues: defaultValues as any
    });

    const onSubmit = async (data: any) => {
        try {
            setIsSaving(true);
            console.log("Form submit triggered");
            const result = await saveProfile(data);
            if (result.success) {
                toast.success("Profile Saved Successfully!");
                router.push(`/${data.display_name}`);
                // optimization: Don't setIsSaving(false) here. 
                // Let the loader persist until the page unmounts/navigates.
            } else {
                console.error("Save failed:", result.error);
                toast.error("Failed to save profile: " + result.error);
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Form submit error:", error);
            toast.error("An unexpected error occurred");
            setIsSaving(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <GlobalLoader isVisible={isSaving} text="Updating your ShareCard profile..." />
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">

                <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 md:p-8 shadow-sm space-y-10">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-1 -ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                            <ChevronLeft className="w-6 h-6" />
                        </Button> */}
                        <div className="text-xl text-gray-300 dark:text-gray-100 font-bold">Update your ShareCard</div>
                    </div>

                    <Accordion type="single" collapsible defaultValue="personal-details" className="w-full mb-8">

                        {/* Section 1: Personal Details */}
                        <AccordionItem value="personal-details" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Building2 className="w-5 h-5" />
                                    Profile Details
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Profile Picture */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Profile Picture <span className="text-red-500">*</span></Label>
                                        <Controller
                                            control={methods.control}
                                            name="userImage"
                                            render={({ field: { onChange, value } }) => (
                                                <ImageUpload
                                                    value={value ? [value] : []}
                                                    onChange={(urls) => onChange(urls[0] || "")}
                                                    maxImages={1}
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Business Logo */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Business Logo</Label>
                                        <Controller
                                            control={methods.control}
                                            name="business_logo"
                                            render={({ field: { onChange, value } }) => (
                                                <ImageUpload
                                                    value={value ? [value] : []}
                                                    onChange={(urls) => onChange(urls[0] || "")}
                                                    maxImages={1}
                                                    disableCropping={true}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <PersonalDetailsStep />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Section 1.5: Positions */}
                        <AccordionItem value="positions" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Briefcase className="w-5 h-5" />
                                    Positions
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <PositionsSection />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Section 2: Social Links */}
                        <AccordionItem value="social-links" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Share2 className="w-5 h-5" />
                                    Social Media Links
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <SocialLinksStep />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Section 3: Services */}
                        <AccordionItem value="services" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Wrench className="w-5 h-5" />
                                    Services
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <ServicesSection />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Section 4: Products */}
                        <AccordionItem value="products" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Package className="w-5 h-5" />
                                    Products
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <ProductsHeader />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Section 5: Gallery */}
                        <AccordionItem value="gallery" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <ImageIcon className="w-5 h-5" />
                                    Gallery
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <GalleryStep />
                            </AccordionContent>
                        </AccordionItem>

                        {/* Brochure Upload */}
                        <AccordionItem value="brochure" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <FileText className="w-5 h-5" />
                                    Brochure
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="space-y-4">
                                    <Controller
                                        control={methods.control}
                                        name="brochure"
                                        render={({ field: { onChange, value } }) => (
                                            <BrochureUpload
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Appointment Booking */}
                        <AccordionItem value="booking" className="py-1">
                            <AccordionTrigger className="hover:no-underline cursor-pointer">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Calendar className="w-5 h-5" />
                                    Appointment Booking
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="booking_url" className="text-sm font-medium">
                                            Booking Page URL
                                        </Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                                            Paste your Google Calendar Appointment Schedule link or Calendly URL
                                        </p>
                                        <Controller
                                            control={methods.control}
                                            name="booking_url"
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    id="booking_url"
                                                    type="url"
                                                    placeholder="https://calendar.app.google/..."
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#1b54e0] focus-visible:border-2"
                                                />
                                            )}
                                        />
                                        {methods.formState.errors.booking_url && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {methods.formState.errors.booking_url.message as string}
                                            </p>
                                        )}
                                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-md">
                                            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                                <strong>How to get your link:</strong><br />
                                                • Google Calendar: Create → Appointment Schedule → Copy booking page link<br />
                                                • Calendly: Copy your scheduling link from your account
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>

                    {/* Submit Button */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Controller
                                control={methods.control}
                                name="terms_accepted"
                                render={({ field }) => (
                                    <Checkbox
                                        id="terms"
                                        className="cursor-pointer"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                I accept the{" "}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <span className="underline text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
                                            Terms and Conditions
                                        </span>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Terms and Conditions</DialogTitle>
                                            <DialogDescription>
                                                Please read our terms and conditions carefully.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="text-sm space-y-4 text-gray-600 dark:text-gray-300 pt-4">
                                            <p><strong>1. Introduction</strong><br />Welcome to ShareCard. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>

                                            <p><strong>2. User Accounts</strong><br />You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

                                            <p><strong>3. Acceptable Use</strong><br />You agree not to use ShareCard for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</p>

                                            <p><strong>4. Content Ownership</strong><br />You retain ownership of the content you post to your profile. However, by posting content, you grant us a license to use, display, and distribute such content in connection with the service.</p>

                                            <p><strong>5. Privacy</strong><br />Your use of ShareCard is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.</p>

                                            <p><strong>6. Termination</strong><br />We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of ShareCard, us, or third parties, or for any other reason.</p>

                                            <p><strong>7. Changes to Terms</strong><br />We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new terms.</p>

                                            <p className="pt-4 text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </label>
                        </div>
                        {methods.formState.errors.terms_accepted && (
                            <p className="text-sm text-red-500 mt-1">{methods.formState.errors.terms_accepted.message as string}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black h-12 text-lg rounded-full shadow-lg cursor-pointer transition-all disabled:opacity-70"
                        >
                            {isSaving ? "Updating..." : "Update ShareCard"}
                        </Button>

                        {/* Validation Error Summary */}
                        {Object.keys(methods.formState.errors).length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    Please fix the following errors:
                                </h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-400">
                                    {Object.entries(methods.formState.errors).map(([key, error]: [string, any]) => {
                                        // Handle nested or array errors if possible, or usually just string message
                                        let message = error.message;
                                        if (!message && error.type) message = `${key} is invalid (${error.type})`;
                                        if (key === 'social_links') message = "Please check Social Media Links";
                                        if (key === 'terms_accepted') message = "You must accept the Terms and Conditions";

                                        // Map field names to human readable
                                        const label = key === 'f_name' ? 'First Name' :
                                            key === 'l_name' ? 'Last Name' :
                                                key === 'phone_no' ? 'Phone Number' :
                                                    key === 'company_name' ? 'Company Name' :
                                                        key === 'display_name' ? 'Display Name' :
                                                            key;

                                        return (
                                            <li key={key}>
                                                <span className="font-medium capitalize">{label}:</span> {message}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}
