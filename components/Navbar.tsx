"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold tracking-tight">
                        VIDRIERA<span className="text-gray-400 font-light ml-1">EL PAISA</span>
                    </Link>

                    <div className="hidden md:flex space-x-12">
                        <Link href="#inicio"
                            className="text-sm font-medium uppercase tracking-wide hover:text-gray-500 transition-colors">Inicio</Link>
                        <Link href="#servicios"
                            className="text-sm font-medium uppercase tracking-wide hover:text-gray-500 transition-colors">Servicios</Link>
                        <Link href="#portafolio"
                            className="text-sm font-medium uppercase tracking-wide hover:text-gray-500 transition-colors">Portafolio</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login"
                            className="text-sm font-medium uppercase tracking-wide hover:text-gray-500 transition-colors hidden md:block">
                            Entrar
                        </Link>
                        <Link href="#contacto"
                            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 border border-black text-sm font-medium uppercase tracking-wide hover:bg-black hover:text-white transition-all duration-300">
                            Cotizar
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
