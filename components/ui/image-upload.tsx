"use client";

import React, { useState, useRef } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    maxImages?: number;
    disableCropping?: boolean;
}

export function ImageUpload({ value = [], onChange, maxImages = 4, disableCropping = false }: ImageUploadProps) {
    // Ensure value is always an array (safety check)
    const normalizedValue = Array.isArray(value) ? value : [];
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper to upload file to helper API
    const uploadToApi = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }

        const data = await res.json();
        return data.url;
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // 5MB limit check is good, but now we upload to disk so 50MB is fine. Keeping it reasonable (10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Image too large (>10MB).");
                return;
            }

            if (disableCropping) {
                setIsCompressing(true);
                try {
                    // Compress lightly before upload
                    const options = {
                        maxSizeMB: 1, // 1MB is fine for disk
                        maxWidthOrHeight: 1200,
                        useWebWorker: true,
                        fileType: "image/webp"
                    };
                    const compressedFile = await imageCompression(file, options);

                    // Upload to API
                    const url = await uploadToApi(compressedFile);
                    onChange([...normalizedValue, url]);

                    setIsCompressing(false);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                } catch (err) {
                    console.error(err);
                    toast.error("Upload failed");
                    setIsCompressing(false);
                }
            } else {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setImageSrc(reader.result?.toString() || null);
                    setIsDialogOpen(true);
                });
                reader.readAsDataURL(file);
            }
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

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/png');
        });
    };

    const handleSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            setIsCompressing(true);
            try {
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                const croppedFile = new File([croppedBlob], "cropped.png", { type: "image/png" });

                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 800,
                    useWebWorker: true,
                    fileType: "image/webp"
                };

                const compressedFile = await imageCompression(croppedFile, options);

                // Upload to API
                const url = await uploadToApi(compressedFile);
                onChange([...normalizedValue, url]);

                setIsDialogOpen(false);
                setImageSrc(null);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
                if (fileInputRef.current) fileInputRef.current.value = "";
                setIsCompressing(false);
            } catch (e) {
                console.error(e);
                toast.error("Error saving image");
                setIsCompressing(false);
            }
        }
    };

    const handleRemove = (index: number) => {
        const newValues = [...normalizedValue];
        newValues.splice(index, 1);
        onChange(newValues);
    };

    return (
        <div className="space-y-4">
            <div className={`grid gap-4 ${maxImages === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'}`}>
                {normalizedValue.map((url, index) => (
                    <div key={index} className={`relative rounded-lg overflow-hidden border ${disableCropping ? 'aspect-square w-full flex items-center justify-center bg-gray-50' : 'aspect-square'}`}>
                        <img
                            src={url}
                            alt="Uploaded image"
                            className={`w-full h-full ${disableCropping ? 'object-contain p-2' : 'object-cover'}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {normalizedValue.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                        <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                ref={fileInputRef}
                className="hidden"
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Adjust Image</DialogTitle>
                    </DialogHeader>

                    <div className="relative w-full h-[300px] bg-gray-100/50">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                                onZoomChange={setZoom}
                            />
                        )}
                    </div>

                    <div className="py-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(vals) => setZoom(vals[0])}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isCompressing} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isCompressing} className="cursor-pointer">
                            {isCompressing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isCompressing ? "Uploading..." : "Save Image"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
