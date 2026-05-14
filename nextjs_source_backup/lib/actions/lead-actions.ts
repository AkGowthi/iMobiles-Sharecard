"use server";

import { Lead } from "@/lib/models";
import { revalidatePath } from "next/cache";

export async function submitLead(profileId: string, data: { name: string; email?: string; phone: string; message?: string }) {
    try {
        if (!data.name || !data.phone) {
            return { success: false, error: "Missing required fields" };
        }

        await Lead.create({
            userProfileId: profileId,
            name: data.name,
            email: data.email || null,
            phone: data.phone,
            message: data.message,
            viewed: false
        });

        return { success: true };
    } catch (error: any) {
        console.error("Error submitting lead:", error);
        return { success: false, error: error.message };
    }
}

export async function getLeads(profileId: string) {
    try {
        const leads = await Lead.findAll({
            where: { userProfileId: profileId },
            order: [['createdAt', 'DESC']]
        });

        // Serialize for client component
        return { success: true, data: leads.map((l: any) => l.toJSON()) };
    } catch (error: any) {
        console.error("Error fetching leads:", error);
        return { success: false, error: error.message };
    }
}
