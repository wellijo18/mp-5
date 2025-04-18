import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import getCollection, { LINKS_COLLECTION } from "@/db";

export async function GET(
    request: NextRequest,
    { params }: { params: { customName: string } }
) {
    try {
        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ customName: params.customName });

        if (!link) {
            redirect("/?error=Link+not+found");
        }

        redirect(link.originalUrl);
    } catch (error) {
        console.error("Error redirecting:", error);
        redirect("/?error=Server+error");
    }
}
