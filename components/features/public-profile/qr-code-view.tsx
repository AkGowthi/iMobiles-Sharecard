"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import QRCodeStyling, {
    DotType,
    CornerSquareType,
    CornerDotType,
    Options
} from "qr-code-styling";

interface QRCodeViewProps {
    profile: any;
    slug: string;
}

export function QRCodeView({ profile, slug }: QRCodeViewProps) {
    const router = useRouter();
    const qrRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
    const [baseUrl, setBaseUrl] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    const {
        f_name, l_name, profession, company_name, userImage,
        qr_favicon, qr_fg_color, qr_dots_style,
        qr_marker_border_style, qr_marker_center_style
    } = profile;
    const fullName = `${f_name} ${l_name}`;
    const profileUrl = `${baseUrl}/${slug}`;

    // Default favicon is ShareCard Icon
    const qrLogo = qr_favicon || (baseUrl ? `${baseUrl}/ShareCard Icon.png` : "/ShareCard Icon.png");

    useEffect(() => {
        setIsMounted(true);
        setBaseUrl(window.location.origin);
    }, []);

    useEffect(() => {
        if (!isMounted || !qrRef.current) return;

        let dotsColorOptions: any = { type: (qr_dots_style || "square") as DotType };
        let cornerSquareOptions: any = { type: (qr_marker_border_style || "square") as CornerSquareType };
        let cornerDotOptions: any = { type: (qr_marker_center_style || "square") as CornerDotType };

        const fgColor = qr_fg_color || "#000000";

        // Parse color - check if it's a gradient JSON or a simple hex string
        try {
            if (fgColor.startsWith("{")) {
                const gradientObj = JSON.parse(fgColor);
                dotsColorOptions.gradient = gradientObj;
                // Apply gradient to corners as well for a consistent look
                cornerSquareOptions.gradient = gradientObj;
                cornerDotOptions.gradient = gradientObj;
            } else {
                dotsColorOptions.color = fgColor;
                cornerSquareOptions.color = fgColor;
                cornerDotOptions.color = fgColor;
            }
        } catch (e) {
            // Fallback
            dotsColorOptions.color = "#000000";
            cornerSquareOptions.color = "#000000";
            cornerDotOptions.color = "#000000";
        }

        const options: Options = {
            width: 300,
            height: 300,
            data: profileUrl,
            image: qrLogo,
            dotsOptions: dotsColorOptions,
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10,
                imageSize: 0.4
            },
            cornersSquareOptions: cornerSquareOptions,
            cornersDotOptions: cornerDotOptions,
            qrOptions: {
                errorCorrectionLevel: "Q"
            }
        };

        const qr = new QRCodeStyling(options);
        qr.append(qrRef.current);
        setQrCode(qr);

        return () => {
            if (qrRef.current) qrRef.current.innerHTML = "";
        };
    }, [isMounted, profileUrl, qrLogo, qr_fg_color, qr_dots_style, qr_marker_border_style, qr_marker_center_style]);

    const handleDownload = () => {
        if (!qrCode) return;
        qrCode.download({
            name: `${f_name}-${l_name}-qr`,
            extension: "png"
        });
    };

    const handleShare = async () => {
        if (!qrCode) return;

        try {
            const blob = await qrCode.getRawData("png");
            if (!blob) return;

            const file = new File([blob as BlobPart], "contact-qr.png", { type: "image/png" });
            if (navigator.share) {
                await navigator.share({
                    title: "Contact QR Code",
                    text: `Connect with ${fullName} on ShareCard`,
                    files: [file]
                });
            } else {
                toast.error("Sharing not supported on this device");
            }
        } catch (error) {
            console.error("Share failed", error);
            toast.error("Failed to share QR code");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-8 md:p-4 relative">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 left-4 rounded-full cursor-pointer"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[38px] shadow-sm border border-gray-100 dark:border-zinc-800 w-full max-w-sm flex flex-col items-center gap-6">

                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-20 bg-gray-200">
                    {userImage ? (
                        <Image src={userImage} alt={fullName} width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                            {f_name[0]}{l_name[0]}
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div className="text-center space-y-1">
                    <h1 className="text-lg md:text-2xl font-bold">{fullName}</h1>
                    <p className="text-gray-500 font-medium text-sm md:text-base">{profession}</p>
                    {company_name && <p className="text-gray-400 text-xs md:text-sm">{company_name}</p>}
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                    <div ref={qrRef} className="[&>canvas]:max-w-full [&>canvas]:h-auto" />
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col gap-1 md:gap-3 w-full">
                    <Button onClick={handleShare} className="w-1/2 md:w-full rounded-full md:h-12 h-10 bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black cursor-pointer">
                        Share QR
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="w-1/2 md:w-full rounded-full md:h-12 h-10 border-gray-200 cursor-pointer">
                        Download QR
                    </Button>
                </div>

            </div>
        </div>
    );
}
