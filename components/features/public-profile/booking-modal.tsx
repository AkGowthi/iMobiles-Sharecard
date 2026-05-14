"use client";

import { Calendar } from "lucide-react";

interface BookingModalProps {
    bookingUrl: string;
    buttonColor: string;
}

export function BookingModal({ bookingUrl, buttonColor }: BookingModalProps) {
    if (!bookingUrl) return null;

    return (
        <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full h-12 mx-auto rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] cursor-pointer flex items-center justify-center"
            style={{
                background: `linear-gradient(135deg, #dcff78 0%, #c9ed65 100%)`,
            }}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            {/* Glow effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                style={{ background: '#dcff78' }}
            />

            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2 h-full px-6">
                <span className="text-gray-800 font-semibold text-lg">
                    Book a Meeting
                </span>
                <svg
                    className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </div>
        </a>
    );
}
