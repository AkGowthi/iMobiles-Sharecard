
import { UserProfile } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const profile = await UserProfile.findByPk(id);

        if (!profile || !profile.dataValues.brochure) {
            return new NextResponse("Brochure not found", { status: 404 });
        }

        const brochureData = profile.dataValues.brochure as string;

        // Check format "data:application/pdf;base64,..."
        if (!brochureData.startsWith("data:application/pdf;base64,")) {
            // If it's a URL (including local /uploads/), redirect to it
            if (brochureData.startsWith("http") || brochureData.startsWith("/uploads/")) {
                return NextResponse.redirect(new URL(brochureData, request.url));
            }
            // If it's just a filename or relative path without slash
            if (!brochureData.startsWith("data:")) {
                return NextResponse.redirect(new URL(brochureData.startsWith("/") ? brochureData : `/${brochureData}`, request.url));
            }
            return new NextResponse("Invalid brochure format: " + brochureData.substring(0, 50) + "...", { status: 500 });
        }

        const base64Content = brochureData.replace(/^data:application\/pdf;base64,/, "");
        const buffer = Buffer.from(base64Content, 'base64');

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="brochure.pdf"',
                "Cache-Control": "public, max-age=3600"
            }
        });

    } catch (error) {
        console.error("Error serving brochure:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
