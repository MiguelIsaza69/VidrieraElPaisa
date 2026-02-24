"use client";

import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function Hero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchSlides = async () => {
            const { data } = await supabase
                .from("hero_slides")
                .select("*")
                .order("created_at", { ascending: false });

            if (data && data.length > 0) {
                setSlides(data);
            } else {
                // Fallback static slide
                setSlides([{
                    title: "Claridad que Define Espacios.",
                    description: "Soluciones arquitectónicas en vidrio y aluminio para quienes valoran la luz, la estética y la funcionalidad moderna.",
                    image_url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                    slogan: "La luz es el primer elemento del diseño."
                }]);
            }
            setLoading(false);
        };
        fetchSlides();
    }, []);

    useEffect(() => {
        // Solo iniciamos el timer si hay más de un slide
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, [slides.length, current]); // Se reinicia el timer cada vez que cambia el slide (manual o auto)

    if (loading) return (
        <div className="h-[70vh] flex items-center justify-center">
            <div className="w-10 h-1 border-t-2 border-black animate-pulse"></div>
        </div>
    );

    const slide = slides[current];

    return (
        <section id="inicio" className="relative min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Text Content */}
                <div key={`text-${current}`} className="animate-reveal-up">
                    <div className="h-1.5 w-24 bg-black mb-10"></div>
                    <h1 className="text-6xl lg:text-8xl font-rethink font-bold leading-[0.9] tracking-tighter mb-10 text-black">
                        {slide.title.split(' ').map((word: string, i: number) => (
                            <span key={i} className={i % 2 === 0 ? "block" : "block opacity-40"}>
                                {word}{" "}
                            </span>
                        ))}
                    </h1>
                    <p className="text-xl text-gray-500 mb-12 max-w-lg font-medium leading-relaxed">
                        {slide.description}
                    </p>
                    <div className="flex gap-4">
                        <Link href="#servicios"
                            className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-2xl flex items-center gap-3 group">
                            Explorar Servicios
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Hero Image Section */}
                <div key={`img-${current}`} className="relative group animate-reveal-up" style={{ animationDelay: "0.2s" }}>
                    <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden shadow-[30px_30px_0px_rgba(0,0,0,0.03)] group-hover:shadow-[0px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-700">
                        <img
                            src={slide.image_url}
                            alt={slide.title}
                            className="object-cover w-full h-full scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out"
                        />
                        <div className="absolute inset-0 bg-black/5 mix-blend-overlay"></div>
                    </div>

                    {/* Slogan Card */}
                    {slide.slogan && (
                        <div className="absolute -bottom-12 -left-12 bg-white p-10 shadow-2xl max-w-xs hidden lg:block">
                            <p className="font-rethink font-bold text-xl text-black leading-tight">
                                "{slide.slogan}"
                            </p>
                            <div className="w-12 h-1 bg-gray-100 mt-6"></div>
                        </div>
                    )}

                    {/* Pagination Indicator */}
                    {slides.length > 1 && (
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-1.5 transition-all duration-500 ${current === i ? 'h-12 bg-black' : 'h-3 bg-gray-200 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -z-0 hidden lg:block"></div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[15rem] font-black text-black/[0.02] select-none pointer-events-none font-rethink hidden lg:block">
                PAISA
            </div>
        </section>
    );
}
