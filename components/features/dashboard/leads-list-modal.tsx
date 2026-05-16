"use client";

import { useState, useEffect } from "react"; // Added useEffect import
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Loader2, User, Phone, Mail, MessageSquare, Check, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { getLeads } from "@/lib/actions/lead-actions";
import { formatDistanceToNow } from "date-fns";

interface LeadsListModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profileId: string;
}

export function LeadsListModal({ open, onOpenChange, profileId }: LeadsListModalProps) {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch leads when modal opens
    useEffect(() => {
        if (open) {
            fetchLeads();
        }
    }, [open, profileId]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const result = await getLeads(profileId);
            if (result.success) {
                setLeads(result.data || []);
            } else {
                toast.error("Failed to load contacts");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading contacts");
        } finally {
            setLoading(false);
        }
    };

    const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);

    const copyLeadDetails = (lead: any) => {
        let text = `Name: ${lead.name}\nPhone: ${lead.phone}`;
        if (lead.email) text += `\nEmail: ${lead.email}`;
        text += `\nMessage: ${lead.message || "N/A"}`;

        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");

        setCopiedLeadId(lead.id);
        setTimeout(() => setCopiedLeadId(null), 2000);
    };

    const downloadVCF = (lead: any) => {
        // Construct VCF data
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${lead.name}
TEL;TYPE=CELL:${lead.phone}
${lead.email ? `EMAIL:${lead.email}` : ''}
END:VCARD`;

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${lead.name.replace(/\s+/g, '_')}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Contact file downloaded");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto w-[95%] rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Leads & Contacts</DialogTitle>
                    <DialogDescription className="hidden">
                        List of recent contacts and leads
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {loading ? (
                        /* Skeleton Loading */
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="border border-gray-100 dark:border-zinc-800 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="skeleton h-5 w-32 rounded" />
                                    <div className="skeleton h-3 w-16 rounded" />
                                </div>
                                <div className="space-y-2">
                                    <div className="skeleton h-3 w-48 rounded" />
                                    <div className="skeleton h-3 w-36 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (leads.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No contacts received yet.</p>
                        </div>
                    ) : (
                        leads.map((lead, index) => (
                            <div key={lead.id} className="bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg p-4 relative group">
                                <div>
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 leading-tight">
                                            {lead.name} <span className="text-gray-400 font-normal text-sm">#{leads.length - index}</span>
                                        </h3>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <span className="text-gray-400 text-xs whitespace-nowrap">
                                                {lead.createdAt ? formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true }).replace('about ', '') : 'Just now'}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                    onClick={() => downloadVCF(lead)}
                                                    title="Save Contact"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                    onClick={() => copyLeadDetails(lead)}
                                                >
                                                    {copiedLeadId === lead.id ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                                        {lead.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5" />
                                                <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                                        </div>
                                        {lead.message && (
                                            <div className="flex items-start gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                                <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                <p className="italic text-gray-500">{lead.message}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        ))
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
