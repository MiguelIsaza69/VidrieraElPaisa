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
    title: "Vidriera Elpaisa",
    description: "Soluciones arquitectónicas en vidrio y aluminio para quienes valoran la luz, la estética y la funcionalidad moderna.",
    icons: {
        icon: "https://res.cloudinary.com/dbeaem1xr/image/upload/v1773157673/Gemini_Generated_Image_ns4ugwns4ugwns4u-removebg-preview_x2q8to.png",
    },
};

import { Toaster } from "sonner";

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
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#f1f5f9",
                            border: "1px solid #cbd5e1",
                            borderRadius: "0px",
                            fontFamily: "var(--font-geist)",
                            color: "#0f172a",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        },
                    }}
                />
                {children}
            </body>
        </html>
    );
}


