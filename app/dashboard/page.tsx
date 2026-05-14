import { auth } from "@/auth";
import { getUserProfile } from "@/lib/data/user-data";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    console.log("Dashboard: Checking session...");
    let session = null;
    try {
        session = await auth();
    } catch (e) {
        console.error("Auth session check failed:", e);
    }

    if (!session?.user?.email) {
        redirect("/login");
    }

    let profile = null;
    try {
        console.log("Dashboard: Fetching profile for", session.user.email);
        profile = await getUserProfile(session.user.email);
        console.log("Dashboard: Profile result:", JSON.stringify(profile, null, 2));
    } catch (error) {
        console.error("Dashboard: Error fetching profile:", error);
        // If DB fails, we might still want to try creating a card or show error
        // For now, fall through to default logic
    }

    // check if profile exists and has a display_name (slug)
    if (profile && profile.display_name) {
        console.log("Dashboard: Redirecting to /" + profile.display_name);
        redirect(`/${profile.display_name}`);
    } else {
        console.log("Dashboard: Redirecting to /create-card (No profile or display_name)");
        redirect("/create-card");
    }
}
