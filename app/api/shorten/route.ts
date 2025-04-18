import { NextRequest, NextResponse } from "next/server";
import getCollection, { LINKS_COLLECTION } from "@/db";

export async function POST(request: NextRequest) {
    try {
        const { url, customName } = await request.json();

        if (!/^https?:\/\//.test(url)) {
            return NextResponse.json({ message: "Please include http:// or https://" }, { status: 400 });
        }

        if (!customName || customName.trim() === "") {
            return NextResponse.json({ message: "Please provide a custom name" }, { status: 400 });
        }

        const collection = await getCollection(LINKS_COLLECTION);
        const existing = await collection.findOne({ customName });

        if (existing) {
            return NextResponse.json({ message: "Custom name is already taken" }, { status: 409 });
        }

        const newLink = {
            originalUrl: url,
            customName,
            createdAt: new Date(),
        };

        await collection.insertOne(newLink);

        return NextResponse.json({ message: "Shortened!", shortenedUrl: `/${customName}` });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
