"use server"

import { redirect } from "next/navigation";
import getCollection, { LINKS_COLLECTION } from "@/db";

interface PageParams {
    customName: string;
}

interface PageProps {
    params: Promise<PageParams>;
}

export default async function RedirectPage({ params }: PageProps) {
    const { customName } = await params;

    try {
        const collection = await getCollection(LINKS_COLLECTION);
        const link = await collection.findOne({ customName });

        if (!link) {
            redirect("/?error=Link+not+found");
        }

        redirect(link.originalUrl);
    } catch (error) {
        console.error("Error during redirect:", error);
        redirect("/?error=Server+error");
    }
}