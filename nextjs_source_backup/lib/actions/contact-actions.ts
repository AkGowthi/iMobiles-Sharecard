
"use server";

import { SavedContact, UserProfile } from "@/lib/models";
import sequelize from "@/lib/db";
import { auth } from "@/auth";

export async function saveContact(data: any) {
    const session = await auth();
    if (!session || !session.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const transaction = await sequelize.transaction();

    try {

        // 1. Get UserProfile to check suffix config
        const profile = await UserProfile.findOne({
            where: { userId: session.user.id },
            transaction
        });

        if (!profile) {
            throw new Error("Profile not found");
        }

        let customId = data.custom_id;

        // Only auto-generate if custom_id was not manually provided
        if (!customId) {
            const prefix = profile.dataValues.contact_suffix_prefix || "C";
            const counter = profile.dataValues.contact_id_counter || 1000;
            customId = `${prefix}${counter}`;

            // 3. Increment Counter only if we used it
            await profile.update({
                contact_id_counter: counter + 1
            }, { transaction });
        }

        // 2. Create SavedContact
        await SavedContact.create({
            userProfileId: profile.dataValues.id,
            ...data,
            custom_id: customId
        }, { transaction });

        await transaction.commit();
        return { success: true, customId };
    } catch (error: any) {
        await transaction.rollback();
        console.error("Error saving contact:", error);
        return { success: false, error: error.message };
    }
}

export async function getScannerSettings() {
    const session = await auth();
    if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const profile = await UserProfile.findOne({ where: { userId: session.user.id } });
        if (!profile) return { success: false, error: "Profile not found" };

        return {
            success: true,
            settings: {
                prefix: profile.dataValues.contact_suffix_prefix || "C",
                counter: profile.dataValues.contact_id_counter || 1000
            }
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateScannerSettings(prefix: string, counter: number) {
    const session = await auth();
    if (!session || !session.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const profile = await UserProfile.findOne({ where: { userId: session.user.id } });
        if (!profile) return { success: false, error: "Profile not found" };

        await profile.update({
            contact_suffix_prefix: prefix,
            contact_id_counter: counter
        });

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
