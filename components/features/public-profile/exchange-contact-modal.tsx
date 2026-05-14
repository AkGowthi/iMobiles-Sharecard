"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Static fallback handler bypassing backend logic for standalone client demonstrations
const submitLead = async (profileId: string, data: any): Promise<{ success: boolean; error?: string }> => {
    console.log("Static lead shared:", data);
    return { success: true };
};
import { Loader2, Share2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ExchangeContactModalProps {
    profileId: string;
    profileName: string;
    buttonColor?: string;
}

export function ExchangeContactModal({ profileId, profileName, buttonColor }: ExchangeContactModalProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await submitLead(profileId, formData);
            if (result.success) {
                setIsSuccess(true);
                toast.success("Info shared successfully!");
                // Close after a brief delay so user sees success message
                setTimeout(() => {
                    setOpen(false);
                    // Reset state after close animation
                    setTimeout(() => {
                        setIsSuccess(false);
                        setFormData({ name: "", phone: "", message: "" });
                    }, 300);
                }, 2000);
            } else {
                toast.error(result.error || "Failed to share info");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full rounded-full h-12 text-lg font-medium hover:bg-transparent cursor-pointer"
                    style={{ color: buttonColor }}
                >
                    Share your details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isSuccess ? "Sent Successfully!" : "Share your details"}</DialogTitle>
                    <DialogDescription>
                        {isSuccess
                            ? `Thanks for sharing your details with ${profileName}.`
                            : `Connect with ${profileName} by sharing your contact info.`}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-green-600">
                        <CheckCircle2 className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">Details Sent</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="First Name Last Name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Mobile Number"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Note (Optional)</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Hi, let's connect!"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full rounded-full text-white" style={{ backgroundColor: buttonColor || '#1b54e0' }} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Details"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
