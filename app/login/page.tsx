"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";

type AuthMode = "LOGIN" | "REGISTER" | "FORGOT";

export default function LoginPage() {
    const [mode, setMode] = useState<AuthMode>("LOGIN");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const supabase = createClient();
    const router = useRouter();

    // Fetch projects for the left side slideshow
    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from("publications")
                .select("*, publication_images(url)")
                .order("created_at", { ascending: false })
                .limit(10);

            if (data) {
                const images = data
                    .map(p => p.publication_images?.[0]?.url)
                    .filter(Boolean);
                setProjects(images);
            }
        };
        fetchProjects();
    }, [supabase]);

    // Slideshow transition
    useEffect(() => {
        if (projects.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % projects.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [projects]);

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

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!acceptedTerms) {
            sileo.error({ description: "Debes aceptar los términos y condiciones." });
            return;
        }
        if (password !== confirmPassword) {
            sileo.error({ description: "Las contraseñas no coinciden." });
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            sileo.error({ description: error.message });
        } else {
            sileo.success({ description: "Registro exitoso. Revisa tu correo para confirmar." });
            setMode("LOGIN");
        }
        setLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) {
            sileo.error({ description: error.message });
        } else {
            sileo.success({ description: "Se ha enviado un correo para restablecer tu contraseña." });
            setMode("LOGIN");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 md:p-10 font-geist">
            <Link
                href="/"
                className="absolute top-10 left-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-black hover:opacity-50 transition-opacity"
            >
                <ArrowLeft className="w-4 h-4" /> Inicio
            </Link>

            <div className="w-full max-w-[1100px] bg-white flex shadow-[0_0_80px_rgba(0,0,0,0.06)] border border-gray-100 min-h-[700px]">
                {/* Left Side: Portfolio Slideshow */}
                <div className="hidden lg:block w-1/2 relative bg-black overflow-hidden group">
                    {projects.length > 0 ? (
                        projects.map((url, idx) => (
                            <div
                                key={idx}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImageIndex ? "opacity-60" : "opacity-0"
                                    }`}
                            >
                                <img
                                    src={url}
                                    alt="Work sample"
                                    className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                            <div className="text-white/20 uppercase tracking-[0.8em] text-lg font-rethink rotate-90">Vidriera El Paisa</div>
                        </div>
                    )}
                    <div className="absolute bottom-16 left-16 right-16 text-white z-10">
                        <span className="text-xs uppercase tracking-[0.4em] font-black opacity-60 mb-3 block">Portafolio</span>
                        <h2 className="text-5xl font-rethink font-bold leading-tight">Expertos en acabados <br /> de alta calidad.</h2>
                    </div>
                    {/* Decorative lines */}
                    <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20 m-10" />

                    {/* Vertical Text */}
                    <div className="absolute top-1/2 -left-32 -translate-y-1/2 -rotate-90">
                        <span className="text-xs uppercase tracking-[1em] text-white/30 font-bold">VIDRIERA EL PAISA</span>
                    </div>
                </div>

                {/* Right Side: Auth Forms */}
                <div className="w-full lg:w-1/2 p-10 md:p-20 flex flex-col justify-center relative bg-white">
                    <div className="mb-14">
                        <h1 className="text-4xl font-rethink font-bold tracking-tight mb-3 text-black">VIDRIERA EL PAISA</h1>
                        <p className="text-sm uppercase tracking-[0.4em] text-gray-400 font-extrabold">
                            {mode === "LOGIN" && "Iniciar Sesión"}
                            {mode === "REGISTER" && "Crea tu cuenta"}
                            {mode === "FORGOT" && "Recuperar Acceso"}
                        </p>
                    </div>

                    {mode === "LOGIN" && (
                        <form onSubmit={handleLogin} className="space-y-8 animate-slide-in-right">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-black text-gray-400">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                    placeholder="hola@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs uppercase tracking-widest font-black text-gray-400">Contraseña</label>
                                    <button
                                        type="button"
                                        onClick={() => setMode("FORGOT")}
                                        className="text-[11px] uppercase tracking-widest font-black text-gray-400 hover:text-black transition-colors"
                                    >
                                        ¿Olvidaste?
                                    </button>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white p-5 text-sm font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                {loading ? "Procesando..." : "Ingresar"}
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <p className="text-center text-xs uppercase tracking-widest text-gray-400 font-black pt-4">
                                ¿No tienes cuenta?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("REGISTER")}
                                    className="text-black hover:underline underline-offset-4"
                                >
                                    Regístrate
                                </button>
                            </p>
                        </form>
                    )}

                    {mode === "REGISTER" && (
                        <form onSubmit={handleSignUp} className="space-y-6 animate-slide-in-right">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-black text-gray-400">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                    placeholder="Ej: Juan Pérez"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-black text-gray-400">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-black text-gray-400">Contraseña</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest font-black text-gray-400">Confirmar</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group cursor-pointer py-2" onClick={() => setAcceptedTerms(!acceptedTerms)}>
                                <div className={`mt-0.5 w-5 h-5 border-2 flex items-center justify-center transition-all ${acceptedTerms ? "bg-black border-black" : "border-gray-300"}`}>
                                    {acceptedTerms && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-wider">
                                    Acepto los <span className="text-black underline underline-offset-2">términos y condiciones</span> de Vidriera El Paisa.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white p-5 text-sm font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                {loading ? "Registrando..." : "Crear Cuenta"}
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <p className="text-center text-xs uppercase tracking-widest text-gray-400 font-black pt-2">
                                ¿Ya tienes cuenta?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("LOGIN")}
                                    className="text-black hover:underline underline-offset-4"
                                >
                                    Inicia Sesión
                                </button>
                            </p>
                        </form>
                    )}

                    {mode === "FORGOT" && (
                        <form onSubmit={handleResetPassword} className="space-y-8 animate-slide-in-right">
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-extrabold leading-relaxed">
                                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu acceso.
                            </p>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-black text-gray-400">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-5 text-base focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] font-medium"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white p-5 text-sm font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                {loading ? "Enviando..." : "Restablecer"}
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            <p className="text-center text-xs uppercase tracking-widest text-gray-400 font-black">
                                <button
                                    type="button"
                                    onClick={() => setMode("LOGIN")}
                                    className="text-black hover:underline underline-offset-4"
                                >
                                    Volver al login
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
