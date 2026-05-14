"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
// import { UserPlus } from "lucide-react"; // Optional: Add an icon
import { trackClick } from "../analytics/view-tracker";

interface ProfileData {
    f_name: string | null;
    l_name: string | null;
    email: string | null;
    phone_no: string | null;
    profession?: string | null;
    company_name?: string | null;
    company_website?: string | null;
    address?: string | null;
    userImage?: string | null;
    // We can add more fields if needed
}

interface AddToContactsButtonProps {
    profile: ProfileData;
    buttonColor?: string;
    profileId: string;
    className?: string;
}

export function AddToContactsButton({ profile, buttonColor, profileId, className }: AddToContactsButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const generateVCF = async () => {
        setIsLoading(true);
        // Track the click
        await trackClick(String(profileId), 'CLICK_CONTACT', { type: 'save_contact' });

        try {
            const { f_name, l_name, email, phone_no, profession, company_name, company_website, address, userImage } = profile;

            const firstName = f_name || "";
            const lastName = l_name || "";
            const fullName = `${firstName} ${lastName}`.trim() || email || "Contact";
            const emailStr = email || "";
            const phoneStr = phone_no || "";

            let vcfString = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${lastName};${firstName};;;
EMAIL:${emailStr}
TEL;TYPE=CELL:${phoneStr}`;

            if (profession) vcfString += `\nTITLE:${profession}`;
            if (company_name) vcfString += `\nORG:${company_name}`;
            if (company_website) vcfString += `\nURL:${company_website}`;
            if (address) vcfString += `\nADR;TYPE=WORK:;;${address};;;;`;

            // Try to fetch and embed image
            if (userImage) {
                try {
                    // Try to fetch the image. Note: this might fail due to CORS if the image is on a different domain without CORS headers.
                    const response = await fetch(userImage);
                    if (response.ok) {
                        const blob = await response.blob();
                        const reader = new FileReader();

                        // We need to wait for the reader
                        const base64Data = await new Promise<string>((resolve, reject) => {
                            reader.onloadend = () => {
                                const result = reader.result as string;
                                // result is data:image/jpeg;base64,.....
                                // We need just the base64 part
                                const base64 = result.split(",")[1];
                                resolve(base64);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });

                        if (base64Data) {
                            // Determine type. Simple check or default to JPEG
                            const type = blob.type.split('/')[1]?.toUpperCase() || 'JPEG';
                            vcfString += `\nPHOTO;ENCODING=b;TYPE=${type}:${base64Data}`;
                        }
                    }
                } catch (imgError) {
                    console.warn("Failed to embed image in VCF:", imgError);
                    // Continue without image
                }
            }

            vcfString += `\nEND:VCARD`;

            // Create blob and download
            const blob = new Blob([vcfString], { type: "text/vcard" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${firstName}_${lastName}.vcf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error generating VCF:", error);
            // Optionally show error toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            className={`w-full rounded-full h-12 text-lg font-medium text-white mb-2 cursor-pointer relative ${className || ""}`}
            style={{ backgroundColor: buttonColor || "#1b54e0" }}
            onClick={generateVCF}
            disabled={isLoading}
        >
            {isLoading ? "Downloading..." : "Add to contacts"}
            {/* {!isLoading && <UserPlus className="w-5 h-5 ml-2" />} */}
        </Button>
    );
}
