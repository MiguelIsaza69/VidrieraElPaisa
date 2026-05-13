"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    // When the user lands here from the email link, Supabase places a
    // recovery session on the client. We verify it exists before
    // letting them set a new password.
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setSessionReady(true);
            } else {
                toast.error("El enlace expiró o no es válido. Solicita uno nuevo.");
                setTimeout(() => router.push("/login"), 2000);
            }
        };
        checkSession();
    }, [supabase, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            toast.error(error.message);
            return;
        }

        toast.success("Contraseña actualizada. Inicia sesión.");
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 md:p-10 font-geist">
            <Link
                href="/"
                className="absolute top-10 left-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-black hover:opacity-50 transition-opacity"
            >
                <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>

            <div className="w-full max-w-md bg-white p-10 md:p-16 shadow-[0_0_80px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="mb-12">
                    <h1 className="text-3xl font-rethink font-bold tracking-tight mb-3 text-black">
                        Nueva contraseña
                    </h1>
                    <p className="text-xs uppercase tracking-[0.4em] text-gray-400 font-extrabold">
                        Restablecer acceso
                    </p>
                </div>

                {!sessionReady ? (
                    <p className="text-sm text-gray-500 font-medium">Validando enlace...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-black text-gray-400">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-medium"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-black text-gray-400">
                                Confirmar
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 font-medium"
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white p-5 text-sm font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Actualizar"}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
