import { NextRequest, NextResponse } from "next/server";
import getCollection, { LINKS_COLLECTION } from "@/db";

// For API routes with dynamic parameters, use this pattern
export async function GET(
    request: NextRequest,
    { params }: { params: { customName: string } }
) {
    try {
        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ customName: params.customName });

        if (!link) {
            return NextResponse.redirect(new URL("/?error=Link+not+found", request.url));
        }

        return NextResponse.redirect(new URL(link.originalUrl, request.url));
    } catch (error) {
        console.error("Error redirecting:", error);
        return NextResponse.redirect(new URL("/?error=Server+error", request.url));
    }
}