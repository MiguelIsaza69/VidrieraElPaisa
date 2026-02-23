"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section id="inicio"
            className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-reveal-up" style={{ animationDelay: "0.1s" }}>
                <div className="h-1 w-20 bg-paisa-silver mb-8"></div>
                <h1 className="text-5xl lg:text-7xl font-light leading-tight mb-8">
                    Claridad que <br /><span className="font-bold">Define Espacios.</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-lg font-light">
                    Soluciones arquitectónicas en vidrio y aluminio para quienes valoran la luz, la estética y la
                    funcionalidad moderna.
                </p>
                <div className="flex gap-4">
                    <Link href="#servicios"
                        className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Explorar Servicios
                    </Link>
                </div>
            </div>
            <div className="relative animate-reveal-up" style={{ animationDelay: "0.3s" }}>
                <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                        alt="Interior Moderno"
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-6 shadow-xl max-w-xs hidden lg:block">
                    <p className="font-serif italic text-lg text-gray-800">"La luz es el primer elemento del diseño."</p>
                </div>
            </div>
        </section>
    );
}
