"use client";

import { Edit3, LogOut, QrCode, Share2, Users, MoreVertical, BarChart2, Settings, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShareModal } from "./share-modal";
import { LogoutModal } from "../auth/logout-modal";
import { LeadsListModal } from "../dashboard/leads-list-modal";
import { AnalyticsDashboard } from "../analytics/analytics-dashboard";
import { SettingsDialog } from "./settings-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileActionsProps {
    username: string; // display_name/slug
    isOwner: boolean;
    profileId?: string;
    profile: any;
}

export function ProfileActions({ username, isOwner, profileId, profile }: ProfileActionsProps) {
    const router = useRouter();
    const [shareOpen, setShareOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [leadsOpen, setLeadsOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    return (
        <>
            <div className="flex gap-1 md:gap-2">
                {/* 1. Edit Button (Primary Action for Owner) */}
                {isOwner && (
                    <button
                        onClick={() => router.push("/create-card")}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Edit Profile"
                    >
                        <Edit3 className="w-5 h-5" />
                    </button>
                )}

                
                {/* 2. Scan Button (Primary Action for Owner) */}
                {isOwner && (
                    <button
                        onClick={() => router.push("/scan")}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="Scan Visiting Card"
                    >
                        <ScanLine className="w-5 h-5" />
                    </button>
                )}

                {/* 3. QR Code Button (Primary Action for Owner) */}
                {isOwner && (
                    <button
                        onClick={() => router.push(`/${username}/qr`)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        title="QR Code"
                    >
                        <QrCode className="w-5 h-5" />
                    </button>
                )}

                {/* 4. Share Button (Always Visible) */}
                <button
                    onClick={() => setShareOpen(true)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Share"
                >
                    <Share2 className="w-5 h-5" />
                </button>

                {/* 5. More Actions (Dropdown for Owner) */}
                {isOwner && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none"
                                title="More Options"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36 rounded-xl p-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl">
                            <DropdownMenuItem
                                onClick={() => setAnalyticsOpen(true)}
                                className="cursor-pointer rounded-lg p-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-800"
                            >
                                <BarChart2 className="w-4 h-4" />
                                <span className="font-medium">Analytics</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setLeadsOpen(true)}
                                className="cursor-pointer rounded-lg p-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-800"
                            >
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Contacts</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setSettingsOpen(true)}
                                className="cursor-pointer rounded-lg p-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-800"
                            >
                                <Settings className="w-4 h-4" />
                                <span className="font-medium">Settings</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={() => setLogoutOpen(true)}
                                className="cursor-pointer rounded-lg p-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="font-medium">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <ShareModal
                open={shareOpen}
                onOpenChange={setShareOpen}
                url={`${origin}/${username}`}
                title={`Check out ${username}'s profile on ShareCard`}
                profile={profile}
                isOwner={isOwner}
            />

            {isOwner && (
                <>
                    <LeadsListModal
                        open={leadsOpen}
                        onOpenChange={setLeadsOpen}
                        profileId={profileId || ""}
                    />
                    <AnalyticsDashboard
                        open={analyticsOpen}
                        onOpenChange={setAnalyticsOpen}
                        profileId={profileId || ""}
                    />
                    <SettingsDialog
                        open={settingsOpen}
                        onOpenChange={setSettingsOpen}
                        profile={profile}
                    />
                </>
            )}

            <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
        </>
    );
}
