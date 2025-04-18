import { NextRequest, NextResponse } from "next/server";
import getCollection, { LINKS_COLLECTION } from "@/db";

export async function POST(request: NextRequest) {
    try {
        const { url, customName } = await request.json();

        let isValidUrl = false;
        try {
            const urlObject = new URL(url);
            isValidUrl = urlObject.protocol === "http:" || urlObject.protocol === "https:";
        } catch (_) {
            isValidUrl = false;
        }

        if (!isValidUrl) {
            return NextResponse.json(
                { message: "Please enter a valid URL with http:// or https://" },
                { status: 400 }
            );
        }

        if (!customName || customName.trim() === "") {
            return NextResponse.json(
                { message: "Please provide a custom name" },
                { status: 400 }
            );
        }

        const collection = await getCollection(LINKS_COLLECTION);

        const existingLink = await collection.findOne({ customName });
        if (existingLink) {
            return NextResponse.json(
                { message: "This name is already taken. Please choose another one." },
                { status: 409 }
            );
        }

        const newLink = {
            originalUrl: url,
            customName: customName,
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newLink);

        if (!result.acknowledged) {
            return NextResponse.json(
                { message: "Something went wrong saving your link" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "URL shortened successfully!",
            shortenedUrl: `/${customName}`,
        });

    } catch (_) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
