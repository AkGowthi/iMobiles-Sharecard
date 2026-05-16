"use server";

import { auth } from "@/auth";
import { UserProfileSchema, SettingsSchema } from "@/lib/schemas/card-schemas";
import { createOrUpdateProfile, getUserProfile } from "@/lib/data/user-data";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: any) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    // Log payload size for debugging
    const payloadSize = JSON.stringify(formData).length;
    console.log(`[saveProfile] Payload size: ${payloadSize} bytes (${(payloadSize / 1024).toFixed(2)} KB)`);
    if (payloadSize > 100000) {
        console.log("[saveProfile] ⚠️ Large payload detected! Checking content...");
        // Check for base64 patterns
        const payloadStr = JSON.stringify(formData);
        if (payloadStr.includes("data:image")) {
            console.log("[saveProfile] 🚨 Base64 image data found in payload!");
        }
    }

    // Validate data
    const validatedFields = UserProfileSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Validation failed", issues: validatedFields.error.issues };
    }

    try {
        // Use getUserProfile to get user data including ID
        const userProfile = await getUserProfile(session.user.email);

        if (!userProfile) {
            return { error: "User not found" };
        }

        await createOrUpdateProfile(userProfile.userId, validatedFields.data);

        revalidatePath("/create-card");
        revalidatePath(`/${validatedFields.data.display_name}`); // Revalidate public profile
        return { success: true };
    } catch (error: any) {
        console.error("FULL Save Profile Error:", error);
        // Return the actual error message to help debugging
        return { error: error.message || "Failed to save profile" };
    }
}

// Separate function for saving only settings (theme, QR code customization)
// This allows saving settings even if other profile fields need correction
export async function saveSettings(settingsData: any) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Unauthorized" };
    }

    // Validate only settings fields
    const validatedSettings = SettingsSchema.safeParse(settingsData);

    if (!validatedSettings.success) {
        return { error: "Validation failed", issues: validatedSettings.error.issues };
    }

    try {
        // Get current profile to merge with settings
        const userProfile = await getUserProfile(session.user.email);

        if (!userProfile) {
            return { error: "User not found" };
        }

        // Check if validatedSettings.data includes full profile (from settings dialog with defaultValues)
        // or just settings fields
        const hasFullProfile = validatedSettings.data.f_name && validatedSettings.data.l_name && validatedSettings.data.company_name;

        let mergedData;
        if (hasFullProfile) {
            // Full profile data provided (from settings dialog), use it directly
            mergedData = validatedSettings.data;
        } else {
            // Only settings fields provided, merge with existing profile
            mergedData = {
                ...userProfile,
                ...validatedSettings.data, // Settings override existing values
            };
        }

        // Now validate the merged data against full schema to ensure it's still valid
        const fullValidation = UserProfileSchema.safeParse(mergedData);

        if (!fullValidation.success) {
            console.error("saveSettings: Full validation failed!", fullValidation.error.issues);
            // Check if errors are in required profile fields
            const issues = fullValidation.error.issues;
            const requiredFieldErrors = issues.filter((issue: any) =>
                ['f_name', 'l_name', 'email', 'phone_no', 'company_name', 'display_name'].includes(issue.path?.[0])
            );

            if (requiredFieldErrors.length > 0) {
                return {
                    error: "Validation failed",
                    issues: requiredFieldErrors,
                    message: "Your profile has missing or invalid details (like Name or Company) in the main edit page. Please fix them there first before saving settings."
                };
            }

            return { error: "Validation failed", issues };
        }

        await createOrUpdateProfile(userProfile.userId, fullValidation.data);

        revalidatePath("/create-card");
        if (mergedData.display_name) {
            revalidatePath(`/${mergedData.display_name}`); // Revalidate public profile
        }
        return { success: true };
    } catch (error: any) {
        console.error("Save Settings Error:", error);
        return { error: error.message || "Failed to save settings" };
    }
}
