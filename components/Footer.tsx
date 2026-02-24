"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-50 pt-20 pb-10 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold tracking-tight mb-6">VIDRIERA EL PAISA</h3>
                        <p className="text-gray-500 font-light max-w-xs mb-8">
                            Innovación y transparencia en cada proyecto. Su aliado experto en vidrio y aluminio en el área
                            metropolitana.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Contacto</h4>
                        <ul className="space-y-4 text-sm text-gray-600 font-light">
                            <li><span className="block font-medium text-black">Vidriera El Paisa</span></li>
                            <li>Tel: +57 301 3700487</li>
                            <li>Medellín, Antioquia</li>
                            <li><a href="mailto:vidrieraelpaisa33@hotmail.com"
                                className="underline hover:text-black">vidrieraelpaisa33@hotmail.com</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Social</h4>
                        <ul className="space-y-4 text-sm text-gray-600 font-light">
                            <li><a href="https://instagram.com/vidrieraelpaisa" target="_blank" rel="noopener noreferrer" className="hover:text-black">Instagram</a></li>
                            <li><Link href="#" className="hover:text-black">Facebook</Link></li>
                            <li><a href="https://wa.me/573013700487" target="_blank" rel="noopener noreferrer" className="hover:text-black">WhatsApp</a></li>
                        </ul>
                    </div>
                </div>

                <div
                    className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-xs text-gray-400 font-light">
                    <p>&copy; {new Date().getFullYear()} Vidriera El Paisa. All rights reserved.</p>
                    <p>Designed for Excellence.</p>
                </div>
            </div>
        </footer>
    );
}
