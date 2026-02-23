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
    const supabase = createClient();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data } = await supabase
            .from("reviews")
            .select("*, profiles(full_name)")
            .order("created_at", { ascending: false })
            .limit(6);
        setReviews(data || []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            sileo.error({ description: "Debes iniciar sesión para dejar una opinión" });
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
            fetchReviews();
        }
        setLoading(false);
    };

    return (
        <section id="opiniones" className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Testimonios</span>
                    <h2 className="text-4xl font-light mt-2">Lo que dicen nuestros clientes</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {reviews.map((review) => (
                        <div key={review.id} className="p-8 border border-gray-100 hover:shadow-lg transition-shadow bg-gray-50/30">
                            <div className="flex gap-1 mb-4 text-paisa-silver">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-600 font-light mb-6 italic">"{review.content}"</p>
                            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                                <span className="text-sm font-bold uppercase tracking-widest">{review.profiles?.full_name || 'Usuario'}</span>
                                <span className="text-[10px] text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-xl mx-auto bg-paisa-black text-white p-12">
                    <h3 className="text-2xl font-light mb-8 text-center">Déjanos tu opinión</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="flex gap-2 mb-2 justify-center">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setRating(num)}
                                        className={`w-10 h-10 flex items-center justify-center border transition-all ${rating >= num ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-500'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">Tu calificación</p>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 text-white font-light focus:border-white outline-none transition-colors min-h-[100px]"
                            placeholder="¿Cómo fue tu experiencia con nosotros?"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Enviando...' : 'Enviar Opinión'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
