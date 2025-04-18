import { NextRequest, NextResponse } from "next/server";
import getCollection, { LINKS_COLLECTION } from "@/db";

export async function GET(
    request: NextRequest,
    context: { params: { customName: string } }
) {
    const { customName } = context.params;

    try {
        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ customName });

        if (!link) {
            return NextResponse.redirect(new URL("/?error=Link+not+found", request.url));
        }

        return NextResponse.redirect(new URL(link.originalUrl));
    } catch (error) {
        console.error("Error redirecting:", error);
        return NextResponse.redirect(new URL("/?error=Server+error", request.url));
    }
}
