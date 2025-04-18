"use client";
import { useState } from "react";
import Header from "./components/header";
import { useRouter } from "next/navigation";

export default function Home() {
    const [url, setUrl] = useState("");
    const [customName, setCustomName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setShortenedUrl("");

        try {
            const response = await fetch("/api/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, customName }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "An error occurred");
                return;
            }

            setShortenedUrl(`${window.location.origin}/${customName}`);
        } catch (error) {
            setErrorMessage("An error occurred while shortening the URL");
        }
    };

    return (
        <>
            <Header />
            <div style={{
                backgroundColor: "#e6f7ff",
                color: "black",
                minHeight: "100vh",
                padding: "2rem 1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <main style={{ width: "100%", maxWidth: "400px" }}>
                    <h1 style={{ fontWeight: "bold", marginBottom: "1.5rem", textAlign: "center" }}>URL Shortener</h1>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label htmlFor="url" style={{ marginBottom: "0.25rem" }}>URL</label>
                            <input
                                type="text"
                                id="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                style={{ border: "1px solid royalblue", padding: "0.25rem", width: "100%" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <label htmlFor="customName" style={{ marginBottom: "0.25rem" }}>Custom Name</label>
                            <input
                                type="text"
                                id="customName"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                required
                                style={{ border: "1px solid royalblue", padding: "0.25rem", width: "100%" }}
                            />
                        </div>
                        <button type="submit">Shorten</button>
                    </form>

                    {errorMessage && <p>{errorMessage}</p>}

                    {shortenedUrl && (
                        <div>
                            <p>Your shortened URL:</p>
                            <a href={shortenedUrl}>{shortenedUrl}</a>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
