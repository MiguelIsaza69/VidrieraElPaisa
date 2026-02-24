import type { Metadata } from "next";
import { Rethink_Sans, Geist } from "next/font/google";
import "./globals.css";

const rethink = Rethink_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-rethink",
});

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Vidriera El Paisa - Moderno",
    description: "Soluciones arquitectónicas en vidrio y aluminio para quienes valoran la luz, la estética y la funcionalidad moderna.",
};

import { Toaster } from "sileo";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className="scroll-smooth">
            <body
                className={`${rethink.variable} ${geist.variable} font-sans antialiased text-paisa-black selection:bg-paisa-black selection:text-white`}
            >
                <Toaster />
                {children}
            </body>
        </html>
    );
}


