import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "700"],
    variable: "--font-outfit",
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
                className={`${outfit.variable} font-sans antialiased text-paisa-black selection:bg-paisa-black selection:text-white`}
            >
                <Toaster />
                {children}
            </body>
        </html>
    );
}
