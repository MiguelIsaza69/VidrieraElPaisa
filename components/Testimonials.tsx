"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { Star } from "lucide-react";

export default function Testimonials() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 6;

    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
        fetchTotalCount();
    }, [page]);

    const fetchTotalCount = async () => {
        const { count } = await supabase
            .from("reviews")
            .select("*", { count: 'exact', head: true });
        setTotalCount(count || 0);
    };

    const fetchReviews = async () => {
        const from = page * limit;
        const to = from + limit - 1;

        const { data } = await supabase
            .from("reviews")
            .select("*, profiles(full_name)")
            .order("created_at", { ascending: false })
            .range(from, to);
        setReviews(data || []);
    };

    const totalPages = Math.ceil(totalCount / limit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            sileo.error({ description: "Debes iniciar sesión para dejar una opinión" });
            setLoading(false);
            return;
        }

        // Check review limit
        const { count, error: countError } = await supabase
            .from("reviews")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", user.id);

        if (count !== null && count >= 50) {
            sileo.error({ description: "Límite alcanzado: máximo 2 opiniones por usuario." });
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("reviews").insert([
            { user_id: user.id, content, rating }
        ]);

        if (error) {
            sileo.error({ description: "Error al enviar opinión" });
        } else {
            sileo.success({ description: "¡Gracias por tu opinión!" });
            setContent("");
            setPage(0);
            fetchReviews();
            fetchTotalCount();
        }
        setLoading(false);
    };

    return (
        <section id="opiniones" className="py-24 bg-white border-t border-gray-100 font-geist">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Testimonios</span>
                    <h2 className="text-4xl font-rethink font-bold mt-3 text-black">Lo que dicen nuestros clientes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-10 border-2 border-gray-50 hover:border-black transition-all bg-white group shadow-sm hover:shadow-2xl flex flex-col min-h-[300px] overflow-hidden">
                            <div className="flex gap-1 mb-5 text-yellow-400 shrink-0">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                                {[...Array(5 - review.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 text-gray-200 fill-transparent" />
                                ))}
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <p className="text-gray-700 text-lg font-medium mb-8 leading-relaxed italic break-words overflow-hidden line-clamp-6">
                                    "{review.content}"
                                </p>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-auto shrink-0">
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black font-rethink truncate max-w-[150px]">
                                    {review.profiles?.full_name || 'Usuario'}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mb-24">
                        <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="p-4 border-2 border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Anterior</span>
                        </button>
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Página <span className="text-black">{page + 1}</span> de {totalPages}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="p-4 border-2 border-gray-100 hover:border-black disabled:opacity-30 disabled:hover:border-gray-100 transition-all"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Siguiente</span>
                        </button>
                    </div>
                )}

                <div className="max-w-2xl mx-auto bg-black text-white p-12 md:p-16 shadow-2xl relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/10 m-8" />

                    <h3 className="text-3xl font-rethink font-bold mb-10 text-center tracking-tight">Tu experiencia nos importa</h3>
                    <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                        <div>
                            <div className="flex gap-4 mb-4 justify-center">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setRating(num)}
                                        className={`w-14 h-14 flex items-center justify-center border-2 transition-all font-rethink font-bold text-lg ${rating >= num ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-[10px] uppercase font-black tracking-[0.3em] text-neutral-500">Selecciona tu calificación</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-500">Tu mensaje</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full bg-neutral-900 border-0 p-6 text-white font-medium focus:ring-2 focus:ring-white outline-none transition-all min-h-[120px] placeholder:text-neutral-700"
                                placeholder="Comparte cómo fue tu experiencia..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-neutral-200 transition-all disabled:opacity-50 shadow-xl"
                        >
                            {loading ? 'Procesando...' : 'Publicar Opinión'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
