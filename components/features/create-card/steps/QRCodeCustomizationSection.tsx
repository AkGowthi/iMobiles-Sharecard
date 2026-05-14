"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { Check, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import QRCodeStyling, {
    DotType,
    CornerSquareType,
    CornerDotType,
    Options
} from "qr-code-styling";
import { Button } from "@/components/ui/button";

const COLORS = [
    { name: "Black", value: "#000000" },
    { name: "Navy", value: "#0c3490ff" },
    { name: "Royal Purple", value: "#5B21B6" },
    { name: "Teal", value: "#0F766E" },
    { name: "Burnt Orange", value: "#db3e00ff" },

];

const GRADIENTS = [
    {
        name: "Twilight",
        value: JSON.stringify({
            type: "linear",
            rotation: 0,
            colorStops: [
                { offset: 0, color: "#000000ff" },
                { offset: 1, color: "#737373ff" }
            ]
        }),
        preview: "linear-gradient(to bottom, #000000ff, #737373ff)"
    },
    {
        name: "Ocean",
        value: JSON.stringify({
            type: "linear",
            rotation: 45,
            colorStops: [
                { offset: 0, color: "#1E3A8A" }, // Deep Blue
                { offset: 1, color: "#0F766E" }  // Teal
            ]
        }),
        preview: "linear-gradient(45deg, #1E3A8A, #0F766E)"
    },
    {
        name: "Sunset",
        value: JSON.stringify({
            type: "linear",
            rotation: 45,
            colorStops: [
                { offset: 0, color: "#C2410C" }, // Burnt Orange
                { offset: 1, color: "#5B21B6" }  // Royal Purple
            ]
        }),
        preview: "linear-gradient(45deg, #C2410C, #5B21B6)"
    }
];

const DOT_STYLES = [
    {
        id: "square", label: "Square", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="6" height="6" fill={color} />
                <rect x="14" y="4" width="6" height="6" fill={color} />
                <rect x="4" y="14" width="6" height="6" fill={color} />
                <rect x="14" y="14" width="6" height="6" fill={color} />
            </svg>
        )
    },
    {
        id: "rounded", label: "Rounded", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="6" height="6" rx="2" fill={color} />
                <rect x="14" y="4" width="6" height="6" rx="2" fill={color} />
                <rect x="4" y="14" width="6" height="6" rx="2" fill={color} />
                <rect x="14" y="14" width="6" height="6" rx="2" fill={color} />
            </svg>
        )
    },
    {
        id: "dots", label: "Dots", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="7" cy="7" r="3" fill={color} />
                <circle cx="17" cy="7" r="3" fill={color} />
                <circle cx="7" cy="17" r="3" fill={color} />
                <circle cx="17" cy="17" r="3" fill={color} />
            </svg>
        )
    },
];

const BORDER_STYLES = [
    {
        id: "square", label: "Square", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="1" stroke={color} strokeWidth="2.5" />
            </svg>
        )
    },
    {
        id: "extra-rounded", label: "Rounded", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="5" stroke={color} strokeWidth="2.5" />
            </svg>
        )
    },
    {
        id: "dot", label: "Circle", icon: (color: string) => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2.5" />
            </svg>
        )
    },
];

const CENTER_STYLES = [
    {
        id: "square",
        label: "Square",
        icon: (color: string) => (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="10" y="10" width="12" height="12" rx="1" fill={color} />
            </svg>
        )
    },
    {
        id: "dot",
        label: "Dot",
        icon: (color: string) => (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="6" fill={color} />
            </svg>
        )
    },

];

export function QRCodeCustomizationSection() {
    const { control, watch, setValue } = useFormContext();
    const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Watch all relevant fields
    const qrFgColor = watch("qr_fg_color") || "#000000";
    const qrDotsStyle = watch("qr_dots_style") || "square";
    const qrMarkerBorderStyle = watch("qr_marker_border_style") || "square";
    const qrMarkerCenterStyle = watch("qr_marker_center_style") || "square";
    const qrFavicon = watch("qr_favicon") || "";
    const displayName = watch("display_name") || "preview"; // Fallback for preview

    // Helper to determine active color for UI feedback
    // If it's a JSON string (gradient), we match that.
    // If it's a hex code, we match that.
    const isGradient = (value: string) => value.startsWith("{");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Initialize and update QR code
    useEffect(() => {
        if (!isMounted || !qrRef.current) return;

        // Construct preview data (using dummy URL for preview if needed, or real one)
        const previewData = `https://sharecard.co.in/${displayName}`;

        let dotsColorOptions: any = { type: qrDotsStyle as DotType };
        let cornerSquareOptions: any = { type: qrMarkerBorderStyle as CornerSquareType };
        let cornerDotOptions: any = { type: qrMarkerCenterStyle as CornerDotType };

        // Parse color - check if it's a gradient JSON or a simple hex string
        try {
            if (qrFgColor.startsWith("{")) {
                const gradientObj = JSON.parse(qrFgColor);
                dotsColorOptions.gradient = gradientObj;
                dotsColorOptions.color = undefined; // Clear solid color if gradient is present

                // Apply same logic to corners
                cornerSquareOptions.gradient = gradientObj;
                cornerSquareOptions.color = undefined;

                cornerDotOptions.gradient = gradientObj;
                cornerDotOptions.color = undefined;
            } else {
                dotsColorOptions.color = qrFgColor;
                dotsColorOptions.gradient = null; // Explicitly clear gradient to ensure it doesn't persist

                cornerSquareOptions.color = qrFgColor;
                cornerSquareOptions.gradient = null;

                cornerDotOptions.color = qrFgColor;
                cornerDotOptions.gradient = null;
            }
        } catch (e) {
            // Fallback to black if parsing fails
            dotsColorOptions.color = "#000000";
            dotsColorOptions.gradient = null;

            cornerSquareOptions.color = "#000000";
            cornerSquareOptions.gradient = null;

            cornerDotOptions.color = "#000000";
            cornerDotOptions.gradient = null;
        }

        const options: Options = {
            width: 250,
            height: 250,
            data: previewData,
            image: qrFavicon,
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

        if (!qrCode) {
            const qr = new QRCodeStyling(options);
            qr.append(qrRef.current);
            setQrCode(qr);
        } else {
            qrCode.update(options);
        }

    }, [
        isMounted,
        qrCode,
        qrFgColor,
        qrDotsStyle,
        qrMarkerBorderStyle,
        qrMarkerCenterStyle,
        qrFavicon,
        displayName
    ]);

    // Get a representative color for the icon previews
    // If gradient, use the first color stop, else use the color itself
    const getPreviewColor = (colorConfig: string) => {
        try {
            if (colorConfig.startsWith("{")) {
                const gradient = JSON.parse(colorConfig);
                return gradient.colorStops?.[0]?.color || "#000000";
            }
            return colorConfig;
        } catch {
            return "#000000";
        }
    }
    const previewIconColor = getPreviewColor(qrFgColor);

    const handleResetStyles = () => {
        setValue("qr_fg_color", "#000000", { shouldDirty: true });
        setValue("qr_dots_style", "square", { shouldDirty: true });
        setValue("qr_marker_border_style", "square", { shouldDirty: true });
        setValue("qr_marker_center_style", "square", { shouldDirty: true });
    };

    return (
        <div className="space-y-8 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Controls */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">QR Logo (Center)</Label>
                            <Button variant="ghost" size="sm" onClick={handleResetStyles} className="text-muted-foreground hover:text-black dark:text-gray-400 dark:hover:text-white h-auto p-0 hover:bg-transparent flex items-center gap-1.5">
                                <RefreshCcw className="w-3.5 h-3.5" />
                                <span className="text-xs">Reset Style</span>
                            </Button>
                        </div>
                        <Controller
                            control={control}
                            name="qr_favicon"
                            render={({ field: { onChange, value } }) => (
                                <div className="w-full md:w-1/2">
                                    <ImageUpload
                                        value={value ? [value] : []}
                                        onChange={(urls) => onChange(urls[0] || "")}
                                        maxImages={1}
                                        disableCropping={true}
                                    />
                                </div>
                            )}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Logo appears in the center of your QR code.</p>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-500">Color Style</Label>
                        <Controller
                            control={control}
                            name="qr_fg_color"
                            render={({ field: { onChange, value } }) => (
                                <div className="space-y-4">
                                    {/* Solid Colors */}
                                    <div className="flex flex-wrap gap-3">
                                        {COLORS.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => onChange(color.value)}
                                                className={cn(
                                                    "w-12 h-12 rounded-lg border-2 transition-all relative overflow-hidden cursor-pointer",
                                                    value === color.value ? "border-blue-500 scale-105" : "border-transparent"
                                                )}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            >
                                                {value === color.value && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                        <Check className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Gradients */}
                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-2 block">Gradients</Label>
                                        <div className="flex flex-wrap gap-3">
                                            {GRADIENTS.map((gradient) => (
                                                <button
                                                    key={gradient.name}
                                                    type="button"
                                                    onClick={() => onChange(gradient.value)}
                                                    className={cn(
                                                        "w-12 h-12 rounded-lg border-2 transition-all relative overflow-hidden cursor-pointer",
                                                        value === gradient.value ? "border-blue-500 scale-105" : "border-transparent"
                                                    )}
                                                    style={{ background: gradient.preview }}
                                                    title={gradient.name}
                                                >
                                                    {value === gradient.value && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                            <Check className="w-6 h-6 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Dots Style */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-500">Dots</Label>
                        <Controller
                            control={control}
                            name="qr_dots_style"
                            render={({ field: { onChange, value } }) => (
                                <div className="flex gap-2">
                                    {DOT_STYLES.map((style) => (
                                        <button
                                            key={style.id}
                                            type="button"
                                            onClick={() => onChange(style.id)}
                                            className={cn(
                                                "w-16 h-16 rounded-xl flex items-center justify-center transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer",
                                                value === style.id ? "border-2 border-blue-500 bg-white" : "border border-gray-200"
                                            )}
                                        >
                                            {style.icon(previewIconColor)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Marker Border Style */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-500">Marker border</Label>
                            <Controller
                                control={control}
                                name="qr_marker_border_style"
                                render={({ field: { onChange, value } }) => (
                                    <div className="flex gap-2">
                                        {BORDER_STYLES.map((style) => (
                                            <button
                                                key={style.id}
                                                type="button"
                                                onClick={() => onChange(style.id)}
                                                className={cn(
                                                    "w-16 h-16 rounded-xl border flex items-center justify-center transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer",
                                                    value === style.id ? "border-2 border-blue-500 bg-white" : "border border-gray-200"
                                                )}
                                            >
                                                {style.icon(previewIconColor)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Marker Center Style */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-500">Marker center</Label>
                            <Controller
                                control={control}
                                name="qr_marker_center_style"
                                render={({ field: { onChange, value } }) => (
                                    <div className="flex gap-2">
                                        {CENTER_STYLES.map((style) => (
                                            <button
                                                key={style.id}
                                                type="button"
                                                onClick={() => onChange(style.id)}
                                                className={cn(
                                                    "w-16 h-16 rounded-xl border flex items-center justify-center transition-all bg-gray-50 hover:bg-gray-100 cursor-pointer",
                                                    value === style.id ? "border-2 border-blue-500 bg-white" : "border border-gray-200"
                                                )}
                                            >
                                                <span className="w-8 h-8">{style.icon(previewIconColor)}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Preview */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white dark:bg-zinc-900 rounded-2xl border p-6 flex flex-col items-center justify-center shadow-sm">
                        <Label className="text-base font-semibold mb-4">Live Preview</Label>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div ref={qrRef} className="[&>canvas]:max-w-full [&>canvas]:h-auto flex justify-center" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                            Preview your customization here.
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
}
