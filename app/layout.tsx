import "@/styles/globals.css"
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Provider from "./Provider";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Nextjs - Permissions and Notifications example",
    description: "App to familiarize and play around with permissions and notifications in Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                variables: {
                    colorPrimary: "#3371FF",
                    fontSize: "16px",
                }
            }}
        >
            <html lang="en">
                <head />
                <body
                    className={cn(
                        "min-h-screen font-sans antialiased",
                        fontSans.variable
                    )}
                >
                    <Provider>
                        {children}
                    </Provider>
                </body>
            </html>
        </ClerkProvider>
    );
}
