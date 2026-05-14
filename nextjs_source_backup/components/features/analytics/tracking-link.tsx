"use client";

import { trackClick } from "./view-tracker";

interface TrackingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    profileId: string;
    eventType: 'CLICK_CONTACT' | 'CLICK_SOCIAL' | 'CLICK_LINK' | 'CLICK_PRODUCT' | 'SHARE';
    eventData?: any;
}

export function TrackingLink({
    profileId,
    eventType,
    eventData,
    onClick,
    children,
    ...props
}: TrackingLinkProps) {

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        trackClick(profileId, eventType, eventData);
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <a onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
