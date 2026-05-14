
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, Phone, Globe, MapPin, Building2, Briefcase, Plus, X, Download, Save } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { saveContact } from "@/lib/actions/contact-actions";

import { useRef } from "react";
// ... imports

interface ContactFormProps {
    initialData: any;
    image: string | null;
    onReset: () => void;
}

export function ContactForm({ initialData, image, onReset }: ContactFormProps) {
    const [formData, setFormData] = useState({ ...initialData, custom_id: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const result = await saveContact({
                ...formData,
                card_image: image
            });

            if (result.success) {
                toast.success(`Contact saved! ID: ${result.customId}`);
                onReset();
            } else {
                toast.error(`Failed to save: ${result.error}`);
            }
        } catch (error) {
            toast.error("An error occurred while saving.");
            console.error(error);
        }
    };

    const handleDownloadVCard = () => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name}
ORG:${formData.company}
TITLE:${formData.designation}
TEL;TYPE=WORK,VOICE:${formData.phone}
EMAIL:${formData.email}
NOTE:${formData.notes}
END:VCARD`;

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${formData.name || "contact"}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("vCard downloaded!");
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 min-h-[600px] rounded-3xl shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900">Card Details</h2>
                        <p className="text-xs text-green-600">Successfully extracted</p>
                    </div>
                </div>
                <button onClick={onReset} className="text-gray-400 hover:text-red-500 cursor-pointer">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Image Preview */}
                {image && (
                    <div className="w-full aspect-video relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
                        <Image src={image} alt="Scanned Card" fill className="object-contain" />
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Manual Custom ID Input */}
                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Customer ID (Optional)</Label>
                        <Input
                            name="custom_id"
                            value={formData.custom_id || ""}
                            onChange={handleChange}
                            className="bg-gray-50 border-gray-100 focus:bg-white"
                            placeholder="e.g. C100, REF-55..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all font-semibold text-lg"
                                placeholder="Full Name"
                            />
                        </div>
                    </div>
                    {/* ... rest of inputs ... */}


                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Phone</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Alternate Mobile (Optional)</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                name="alt_phone"
                                value={formData.alt_phone || ""}
                                onChange={handleChange}
                                className="pl-10 h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all font-medium"
                                placeholder="Alternate Mobile Number"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-500 font-medium">Company</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="pl-9 bg-gray-50 border-gray-100"
                                    placeholder="Company"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gray-500 font-medium">Designation</Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="pl-9 bg-gray-50 border-gray-100"
                                    placeholder="Job Title"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-500 font-medium">Notes</Label>
                        <Textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="bg-gray-50 border-gray-100 min-h-[100px]"
                            placeholder="Additional details..."
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 bg-white flex flex-col gap-3">
                <div className="flex gap-3">
                    <Button
                        onClick={handleDownloadVCard}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download vCard
                    </Button>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={onReset}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Edit or Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
