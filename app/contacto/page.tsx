"use client";

import Navbar from "@/components/Navbar";
import { MessageCircle, Instagram, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Contacto() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Contenido Izquierda */}
                    <div className="animate-reveal-up">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 block">Estamos para ayudarte</span>
                        <h1 className="text-6xl md:text-8xl font-rethink font-bold text-black tracking-tighter mb-8 leading-none">
                            Vidriera <br /> <span className="text-gray-300">El Paisa</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-md mb-12 leading-relaxed">
                            Transformamos tus espacios con la elegancia del vidrio y la resistencia del aluminio. Contáctanos para una asesoría personalizada.
                        </p>

                        <div className="flex flex-col gap-6">
                            <a
                                href="https://wa.me/573013700487"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between bg-black text-white p-6 md:p-8 hover:bg-neutral-800 transition-all shadow-2xl"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="bg-white/10 p-4 rounded-full">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Escríbenos por</p>
                                        <p className="text-xl font-bold">WhatsApp</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </a>

                            <a
                                href="https://instagram.com/vidrieraelpaisa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between border-2 border-gray-100 p-6 md:p-8 hover:border-black transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="bg-gray-50 p-4 rounded-full">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Síguenos en</p>
                                        <p className="text-xl font-bold">Instagram</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Información Derecha */}
                    <div className="bg-gray-50 p-12 lg:p-20 relative overflow-hidden animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-12">Información Directa</h3>

                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Teléfono</p>
                                        <p className="text-lg font-bold">+57 301 3700487</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Ubicación</p>
                                        <p className="text-lg font-bold">Medellín, Antioquia</p>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email</p>
                                        <p className="text-lg font-bold">vidrieraelpaisa33@hotmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Elemento Decorativo */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
