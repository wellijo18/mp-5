import { redirect } from "next/navigation";
import getCollection, { LINKS_COLLECTION } from "@/db";

export default async function RedirectPage({
                                               params,
                                           }: {
    params: { customName: string };
}) {
    const collection = await getCollection(LINKS_COLLECTION);
    const link = await collection.findOne({ customName: params.customName });

    if (!link) {
        redirect("/?error=Link+not+found");
    }

    redirect(link.originalUrl);
}
