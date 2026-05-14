"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Link2, Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    title: string;
    profile: any;
    isOwner: boolean;
}

export function ShareModal({ open, onOpenChange, url, title, profile, isOwner }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [textCopied, setTextCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleCopyText = async () => {
        try {
            if (!profile) return;

            const { f_name, l_name, profession, company_name, company_description, company_website, map_url, brochure, positions, services, products, phone_no, email, socialHandles } = profile;

            // Function to decode JSON if needed
            const safeParse = (data: any) => {
                try {
                    return typeof data === 'string' ? JSON.parse(data) : data;
                } catch {
                    return [];
                }
            };

            const servicesList = safeParse(services);
            const positionsList = safeParse(positions);

            // Build the string
            let text = "";

            text += `*Name*\n${f_name} ${l_name}\n\n`;
            if (profession) text += `*Role*\n${profession}\n\n`;
            if (company_name) text += `*Company*\n${company_name}\n\n`;

            text += `*Contact Options*\n`;
            if (phone_no) text += `Phone: ${phone_no}\n`;
            if (email) text += `Email: ${email}\n`;
            // Check for WhatsApp
            const hasWhatsapp = socialHandles?.find((h: any) => Number(h.type_id) === 1);
            if (hasWhatsapp) {
                const cleanNum = hasWhatsapp.soc_link.replace(/\D/g, '');
                text += `WhatsApp: https://wa.me/91${cleanNum}\n`;
            }
            text += `\n`;

            text += `*Business Info*\n`;
            if (company_name) text += `Company Name: ${company_name}\n`;
            if (company_description) text += `Tagline: ${company_description}\n`;
            if (company_website) text += `Website: ${company_website}\n`;
            text += `\n`;

            if (positionsList && positionsList.length > 0) {
                text += `*Positions*\n`;
                positionsList.forEach((pos: any) => {
                    text += `${pos.title}${pos.org ? ` — ${pos.org}` : ''}\n`;
                });
                text += `\n`;
            }

            if (servicesList && servicesList.length > 0) {
                text += `*Services*\n`;
                servicesList.forEach((service: string) => {
                    text += `${service}\n`;
                });
                text += `\n`;
            }

            if (products && products.length > 0) {
                text += `*Products*\n`;
                products.forEach((prod: any) => {
                    text += `${prod.prod_name}${prod.prod_description ? ` — ${prod.prod_description}` : ''}\n`;
                });
                text += `\n`;
            }

            await navigator.clipboard.writeText(text);
            setTextCopied(true);
            toast.success("Profile text copied to clipboard!");
            setTimeout(() => setTextCopied(false), 2000);
        } catch (err) {
            console.error(err);
            toast.error("Failed to copy text");
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Share Profile",
                    text: title,
                    url: url,
                });
                onOpenChange(false);
            } catch (err: any) {
                // Ignore AbortError which happens when user cancels the share dialog
                if (err.name !== 'AbortError') {
                    console.error("Error sharing:", err);
                }
            }
        } else {
            toast.error("Web Share API not supported on this browser");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[340px] rounded-3xl p-6">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-center">Share your profile</DialogTitle>
                    <DialogDescription className="hidden">
                        Choose how you want to share this profile.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    {/* Copy Link Button */}
                    <button
                        onClick={handleCopy}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {copied ? (
                                <Check className="w-5 h-5 text-green-600" />
                            ) : (
                                <Link2 className="w-5 h-5 text-gray-700" />
                            )}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Copy link</div>
                            <div className="text-sm text-gray-500">Copy profile URL to clipboard</div>
                        </div>
                    </button>

                    {/* Copy Text Button */}
                    {isOwner && (
                        <button
                            onClick={handleCopyText}
                            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left group cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                {textCopied ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-700" />
                                )}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">Copy formatted text</div>
                                <div className="text-sm text-gray-500">Copy structured profile for chat</div>
                            </div>
                        </button>
                    )}

                    {/* Share Profile Button (Native) */}
                    <button
                        onClick={handleShare}
                        className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-left group cursor-pointer"
                    >
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <Share2 className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">Share profile</div>
                            <div className="text-sm text-gray-500">Share via social or messaging apps</div>
                        </div>
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-400">
                    Share your ShareCard with the world
                </div>
            </DialogContent>
        </Dialog>
    );
}
