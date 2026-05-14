import { getProfileBySlug } from "@/lib/data/user-data";
import { notFound } from "next/navigation";
import { QRCodeView } from "../../../components/features/public-profile/qr-code-view";

export default async function QRPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch data on the server
    const profile = await getProfileBySlug(slug);

    if (!profile) {
        notFound();
    }

    // Pass data to the Client Component
    return <QRCodeView profile={profile} slug={slug} />;
}
