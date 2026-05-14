"use client";

import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

// Client static fallback for purely uncoupled HTML presentations
const trackEvent = async (profileId: string, eventType: string, eventData?: any, visitorId?: string) => {
    console.log("Static Analytics Tracked:", eventType, profileId);
    return { success: true };
};

export function ViewTracker({ profileId }: { profileId: string }) {
    useEffect(() => {
        const trackView = async () => {
            // 1. Get or create Visitor ID
            let visitorId = localStorage.getItem("sc_visitor_id");
            if (!visitorId) {
                visitorId = uuidv4();
                localStorage.setItem("sc_visitor_id", visitorId);
            }

            // 2. Track View Event
            // Uses session storage to prevent duplicate view counts on refresh within same session
            const sessionKey = `sc_viewed_${profileId}`;
            if (!sessionStorage.getItem(sessionKey)) {
                await trackEvent(profileId, 'VIEW', {}, visitorId || undefined);
                sessionStorage.setItem(sessionKey, 'true');
            }
        };

        trackView();
    }, [profileId]);

    return null; // Headless component
}

// Helper to track clicks
export const trackClick = async (profileId: string, type: 'CLICK_CONTACT' | 'CLICK_SOCIAL' | 'CLICK_LINK' | 'CLICK_PRODUCT' | 'SHARE', data: any) => {
    const visitorId = localStorage.getItem("sc_visitor_id");
    await trackEvent(profileId, type, data, visitorId || undefined);
};
