"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PerfilPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile(profile);
            setFullName(profile?.full_name || "");
            setLoading(false);
        };

        getUser();
    }, [supabase, router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: fullName,
                updated_at: new Date().toISOString(),
            });

        if (error) {
            sileo.error({ description: "Error al actualizar perfil" });
        } else {
            sileo.success({ description: "Perfil actualizado" });
        }
        setLoading(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-light">Cargando...</div>;

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-40 pb-20 px-6 max-w-2xl mx-auto w-full">
                <h1 className="text-4xl font-light mb-12 animate-reveal-up">Mi Perfil</h1>

                <form onSubmit={handleUpdate} className="space-y-8 animate-reveal-up" style={{ animationDelay: "0.1s" }}>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-gray-400 outline-none font-light"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nombre Completo</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 mt-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="w-full border border-red-500 text-red-500 py-4 text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </main>
    );
}
