import { redirect } from "next/navigation";
import getCollection, { LINKS_COLLECTION } from "@/db";

export default async function RedirectPage({ params }: { params: { customName: string } }) {
    const { customName } = params;

    try {
        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ customName });

        if (!link) {
            redirect("/?error=Link+not+found");
        }

        redirect(link.originalUrl);
    } catch (error) {
        console.error("Redirect error:", error);
        redirect("/?error=Server+error");
    }
}
