
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, ArrowLeft, ScanLine, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { ContactForm } from "./ContactForm";
import Cropper, { Point, Area } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";



export function ScannerInterface() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [extractedData, setExtractedData] = useState<any>(null);

    // Cropper State
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [showCropper, setShowCropper] = useState(false);

    if (extractedData) {
        return (
            <ContactForm
                initialData={extractedData}
                image={image}
                onReset={() => {
                    setExtractedData(null);
                    setImage(null);
                    setShowCropper(false);
                    setZoom(1);
                    setRotation(0);
                    setCrop({ x: 0, y: 0 });
                }}
            />
        );
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getRadianAngle = (degreeValue: number) => {
        return (degreeValue * Math.PI) / 180;
    };

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const rotRad = getRadianAngle(rotation);

        // calculate bounding box of the rotated image
        const { width: bBoxWidth, height: bBoxHeight } = {
            width: Math.abs(Math.cos(rotRad) * image.naturalWidth) + Math.abs(Math.sin(rotRad) * image.naturalHeight),
            height: Math.abs(Math.sin(rotRad) * image.naturalWidth) + Math.abs(Math.cos(rotRad) * image.naturalHeight),
        };

        canvas.width = bBoxWidth;
        canvas.height = bBoxHeight;

        // translate canvas context to a central location to allow rotating and flipping around the center
        ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height
        );

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(data, 0, 0);

        // --- PRE-PROCESSING FOR OCR ---

        // Enhance Contrast & Binarize
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
            // Grayscale
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            // Contrast Boosting (Simple Thresholding / Binarization)
            // If lighter than 128, make it white (255), else black (0)
            // This is "Binarization" - standard fix for OCR accuracy
            v = v > 100 ? 255 : 0;

            d[i] = d[i + 1] = d[i + 2] = v;
        }
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL('image/jpeg');
    };

    const handleCropAndScan = async () => {
        if (image && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
                setShowCropper(false);
                performOCR(croppedImage);
            } catch (e) {
                console.error(e);
                toast.error("Failed to crop image");
            }
        }
    };

    const performOCR = async (imageData: string) => {
        setIsScanning(true);
        try {
            const worker = await createWorker('eng');
            const { data: { text } } = await worker.recognize(imageData);
            console.log("OCR Result:", text);

            const parsedData = parseContactDetails(text);
            setExtractedData(parsedData);

            await worker.terminate();
        } catch (error) {
            console.error(error);
            toast.error("Failed to scan card. Please try again.");
        } finally {
            setIsScanning(false);
        }
    };

    const parseContactDetails = (text: string) => {
        let cleanText = text
            .replace(/ATLL PA/gi, "")
            .replace(/^To /gim, "")
            .replace(/\|/g, "I");

        const rawLines = cleanText.split('\n');
        const processedLines: string[] = [];

        const phoneSplitRegex = /(@|www\.|https?:|(\+?\d[\d\s-]{7,}\d))/;
        const companySuffixes = ["Pvt. Ltd.", "Pvt Ltd", "Private Limited", "Ltd.", "Inc.", "LLC"];

        for (const line of rawLines) {
            let splitHappened = false;
            for (const suffix of companySuffixes) {
                if (line.includes(suffix)) {
                    const idx = line.indexOf(suffix);
                    const afterSuffix = line.substring(idx + suffix.length);
                    // Loose check: if after suffix includes digits that look like phone
                    if (afterSuffix.match(/\d{5,}/)) {
                        const part1 = line.substring(0, idx + suffix.length).trim();
                        const part2 = afterSuffix.trim();
                        if (part1) processedLines.push(part1);
                        if (part2) processedLines.push(part2);
                        splitHappened = true;
                        break;
                    }
                }
            }
            if (!splitHappened) {
                processedLines.push(line);
            }
        }

        const lines = processedLines
            .map(l => l.trim())
            .filter(l => l.length > 1);

        let email = "";
        let phone = "";
        let alt_phone = "";
        let website = "";
        let designation = "";
        let name = "";
        let company = "";
        let remainingLines: string[] = [];

        const emailRegex = /[\w.-]+@[\w.-]+\.[\w.-]+/i;
        const websiteRegex = /^(https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,}(\.[a-z]{2,})?$/i;
        const jobTitleRegex = /\b(CEO|CTO|CFO|COO|Founder|Co-Founder|Director|Manager|Executive|President|Vice President|VP|Head|Lead|Chief|Officer|Partner|Owner|Proprietor|Engineer|Developer|Consultant|Specialist|Associate|Analyst)\b/i;
        const companyRegex = /\b(Pvt\.? Ltd\.?|Private Limited|Ltd\.?|Limited|Inc\.?|Incorporated|LLC|LLP|Corp\.?|Corporation|Solutions|Services|Technologies|Technovation|Group|Enterprises|Innovations|Systems|Global|Infotech)\b/i;

        // Revised Phone Regex: Matches typical international formats allowing 2-digit groups
        // e.g. +91 96 98 73 9898 -> matches +91 96 98 73 9898
        const loosePhoneRegex = /(\+?(\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?){1,5}\d{2,})/g;

        for (const line of lines) {
            let handled = false;

            if (!email) {
                const match = line.match(emailRegex);
                if (match) {
                    email = match[0];
                    handled = true;
                }
            }

            if (!phone || !alt_phone) {
                const matches = line.match(loosePhoneRegex);
                if (matches) {
                    for (const match of matches) {
                        // Validate: Must have at least 7 digits
                        const digitCount = (match.match(/\d/g) || []).length;
                        if (digitCount >= 7 && digitCount <= 15) {
                            if (!match.includes("/") && !match.includes(".com")) {
                                const cleanNumber = match.replace(/\s/g, "").trim();

                                if (!phone) {
                                    phone = cleanNumber;
                                } else if (!alt_phone && cleanNumber !== phone) {
                                    alt_phone = cleanNumber;
                                }

                                // Check if we exhausted the line
                                if (line.replace(match, "").trim().length < 3) {
                                    handled = true;
                                }
                            }
                        }
                    }
                }
            }

            if (!website && !handled) {
                if (line.match(websiteRegex) || line.toLowerCase().includes("www.") || line.toLowerCase().endsWith(".com") || line.toLowerCase().endsWith(".in") || line.toLowerCase().endsWith(".org")) {
                    const match = line.match(/[\w-]+\.\w+(\.\w+)?/);
                    let url = match ? match[0] : line;
                    if (url.startsWith("wvw.")) url = url.replace("wvw.", "www.");
                    website = url;
                    handled = true;
                }
            }

            if (!designation && !handled) {
                const match = line.match(jobTitleRegex);
                if (match) {
                    // Clean prefix: "ees d Chief..." -> "Chief..."
                    const index = line.indexOf(match[0]);
                    if (index > 0) {
                        designation = line.substring(index);
                    } else {
                        designation = line;
                    }
                    handled = true;
                }
            }

            if (!company && !handled) {
                if (line.match(companyRegex)) {
                    company = line;
                    handled = true;
                }
            }

            if (!handled) {
                const lower = line.toLowerCase();
                if (!lower.includes("designed by") && !lower.includes("scan to") && line.length > 2) {
                    remainingLines.push(line);
                }
            }
        }

        if (remainingLines.length > 0 && !name) {
            let candidate = remainingLines[0];
            // Cleaning Name
            candidate = candidate.replace(/^nu tz fa\s*/i, "");
            candidate = candidate.replace(/^[a-z]{1,2}\s+[a-z]{1,2}\s+/i, "");

            if (!/\d.*\d/.test(candidate)) {
                name = candidate;
                remainingLines.shift();
            }
        }

        if (remainingLines.length > 0 && !company) {
            company = remainingLines[0];
            remainingLines.shift();
        }

        const notes = remainingLines.join('\n');

        return {
            name,
            email,
            phone,
            alt_phone,
            website,
            company,
            designation,
            address: "",
            notes
        };
    };

    const handleCameraClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute("capture", "environment");
            fileInputRef.current.click();
        }
    };

    const handleGalleryClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.removeAttribute("capture");
            fileInputRef.current.click();
        }
    };

    if (extractedData) {
        return (
            <ContactForm
                initialData={extractedData}
                image={image}
                onReset={() => {
                    setExtractedData(null);
                    setImage(null);
                    setShowCropper(false);
                    setZoom(1);
                    setRotation(0);
                    setCrop({ x: 0, y: 0 });
                }}
            />
        );
    }

    return (
        <div className="w-full bg-white dark:bg-zinc-900 h-[calc(100vh-2rem)] rounded-3xl shadow-xl overflow-hidden flex flex-col relative my-auto">
            <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold">Scan Visiting Card</h1>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-6 gap-8">
                {isScanning ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                                <ScanLine className="w-10 h-10 text-blue-500 animate-bounce" />
                            </div>
                        </div>
                        <p className="font-medium text-gray-600">Enhanced Scanning (High Contrast)...</p>
                        <p className="text-sm text-gray-400">Please wait while we extract info</p>
                    </div>
                ) : showCropper && image ? (
                    <div className="w-full h-full flex flex-col gap-4">
                        <div className="relative w-full flex-1 min-h-[300px] bg-black rounded-lg overflow-hidden hidden-cropper-container">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                onCropChange={setCrop}
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                restrictPosition={false}
                            />
                        </div>

                        <div className="space-y-4 px-4 shrink-0">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </div>
                                <Slider
                                    value={[zoom]}
                                    min={0.5}
                                    max={3}
                                    step={0.1}
                                    onValueChange={(vals) => setZoom(vals[0])}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Rotation</span>
                                    <span>{rotation}°</span>
                                </div>
                                <div className="flex gap-2 justify-center">
                                    <Button variant="outline" size="sm" onClick={() => setRotation((r) => r - 90)}>
                                        <RotateCw className="w-4 h-4 mr-1 -scale-x-100" /> -90°
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setRotation((r) => r + 90)}>
                                        <RotateCw className="w-4 h-4 mr-1" /> +90°
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-center text-muted-foreground shrink-0 mt-2">
                            Drag corners to select card. <b>Rotate</b> if text looks sideways.
                        </p>
                        <div className="flex gap-4 w-full shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCropper(false);
                                    setImage(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCropAndScan}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Scan Card
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-64 h-40 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
                            <ScanLine className="w-12 h-12 text-blue-500" />
                            <p className="text-center text-sm text-gray-500">Scan a Visiting card to begin</p>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                        />

                        <div className="flex gap-4 w-full max-w-xs">
                            <Button
                                onClick={handleCameraClick}
                                className="flex-1 h-12 rounded-full bg-[#1B54E0] hover:bg-blue-700 text-white gap-2 text-base font-medium"
                            >
                                <Camera className="w-6 h-6" />
                                Camera
                            </Button>
                            <Button
                                onClick={handleGalleryClick}
                                className="flex-1 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white gap-2 text-base font-medium"
                            >
                                <ImageIcon className="w-6 h-6" />
                                Gallery
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
