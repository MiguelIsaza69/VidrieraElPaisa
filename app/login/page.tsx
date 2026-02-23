"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            sileo.error({ description: error.message });
            setLoading(false);
        } else {
            sileo.success({ description: "¡Bienvenido de nuevo!" });
            router.push("/");
            router.refresh();
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            sileo.error({ description: error.message });
        } else {
            sileo.success({ description: "Registro exitoso. Revisa tu correo." });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <Link href="/" className="absolute top-12 left-6 lg:left-12 flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-500 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver
            </Link>

            <div className="w-full max-w-md animate-reveal-up">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">VIDRIERA EL PAISA</h2>
                    <p className="text-gray-500 font-light">Accede a tu cuenta o regístrate</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light"
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light"
                            placeholder="********"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Cargando..." : "Iniciar Sesión"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSignUp}
                            disabled={loading}
                            className="w-full border border-black text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all disabled:opacity-50"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
