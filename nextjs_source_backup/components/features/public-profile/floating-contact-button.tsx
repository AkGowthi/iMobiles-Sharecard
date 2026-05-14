"use client";

import { useEffect, useState } from "react";
import { AddToContactsButton } from "./add-to-contacts-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FloatingContactButtonProps {
    profile: any;
    profileId: string;
    buttonColor: string;
}

export function FloatingContactButton({ profile, profileId, buttonColor }: FloatingContactButtonProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Show button after scrolling down 300px
            if (scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 w-full max-w-md left-1/2 -translate-x-1/2 px-5 z-40 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="shadow-xl rounded-full">
                <AddToContactsButton
                    profile={profile}
                    profileId={profileId}
                    buttonColor={buttonColor}
                    className="w-full py-6 text-lg font-bold shadow-none"
                />
            </div>
        </div>
    );
}
