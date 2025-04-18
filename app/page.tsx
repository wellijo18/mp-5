"use client";

import { useState } from "react";

export default function Home() {
    const [url, setUrl] = useState("");
    const [customName, setCustomName] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setShortenedUrl("");

        try {
            const res = await fetch("/api/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, customName }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Unknown error");
                return;
            }

            setShortenedUrl(`${window.location.origin}${data.shortenedUrl}`);
        } catch {
            setError("Something went wrong");
        }
    };

    return (
        <main style={{ padding: "2rem", textAlign: "center" }}>
            <h1>URL Shortener</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    style={{ marginBottom: "0.5rem", width: "300px" }}
                />
                <br />
                <input
                    type="text"
                    placeholder="custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    style={{ marginBottom: "0.5rem", width: "300px" }}
                />
                <br />
                <button type="submit">Shorten</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {shortenedUrl && (
                <p>
                    Shortened URL: <a href={shortenedUrl}>{shortenedUrl}</a>
                </p>
            )}
        </main>
    );
}
