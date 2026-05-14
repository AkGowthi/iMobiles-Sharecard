
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, FileText, Upload, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

interface BrochureUploadProps {
    value?: string;
    onChange: (value: string) => void;
}

export function BrochureUpload({ value, onChange }: BrochureUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showCompressionHint, setShowCompressionHint] = useState(false);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validation
            if (file.type !== "application/pdf") {
                toast.error("Only PDF files are allowed.");
                return;
            }
            // 20MB limit for PDF uploads to disk
            if (file.size > 20 * 1024 * 1024) {
                toast.error("File too large. Please compress to under 20MB.");
                setShowCompressionHint(true);
                return;
            }

            setShowCompressionHint(false); // Reset on valid file
            setIsUploading(true);

            try {
                // Upload to API
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

                onChange(data.url);
                toast.success("Brochure uploaded successfully!");
                setIsUploading(false);
            } catch (error) {
                console.error(error);
                toast.error("Error uploading file.");
                setIsUploading(false);
            }
        }
    };

    const handleRemove = () => {
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="flex flex-col items-center gap-4 border-2 border-dashed rounded-xl p-6 bg-gray-50/50 dark:bg-zinc-900/50 hover:bg-gray-100/50 transition-colors">
            <input
                type="file"
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={onFileChange}
            />

            {value ? (
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm w-full max-w-sm border">
                    <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg text-red-600">
                        <FileText className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">Brochure.pdf</p>
                        <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                    <div className="flex gap-1">
                        {/* Download/View Link if needed, but for base64 it's tricky to direct link without blob. 
                            For now, assuming display only or creating a temporary link. */}
                        <a href={value} download="Brochure.pdf" className="p-2 hover:bg-muted rounded-full" title="Download">
                            <Download className="w-4 h-4 text-gray-500" />
                        </a>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-2 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-full inline-block shadow-sm">
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : (
                            <Upload className="w-6 h-6 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-sm">Click to upload Brochure</p>
                        <p className="text-xs text-muted-foreground">PDF only (Max 5MB)</p>
                        {showCompressionHint && (
                            <a
                                href="https://www.ilovepdf.com/compress_pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                File too big? Compress PDF
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
