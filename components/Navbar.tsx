"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, ChevronDown, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Check current session
        const getSession = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    console.log("Sesión no encontrada o error de bloqueo:", error.message);
                    return;
                }

                setUser(user);
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();
                    setRole(profile?.role || 'user');
                }
            } catch (err) {
                console.warn("Error silencioso en getSession (posible timeout de lock):", err);
            }
        };
        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setRole(profile?.role || 'user');
            } else {
                setRole(null);
            }
        });

        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
        router.refresh();
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 font-geist ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-3xl font-rethink font-bold tracking-tight">
                        VIDRIERA<span className="text-gray-400 font-light ml-1">EL PAISA</span>
                    </Link>

                    <div className="hidden md:flex space-x-12">
                        <Link href="/#inicio"
                            className="text-sm font-extrabold uppercase tracking-widest hover:text-gray-500 transition-colors">Inicio</Link>
                        <Link href="/#servicios"
                            className="text-sm font-extrabold uppercase tracking-widest hover:text-gray-500 transition-colors">Servicios</Link>
                        <Link href="/#portafolio"
                            className="text-sm font-extrabold uppercase tracking-widest hover:text-gray-500 transition-colors">Portafolio</Link>
                        <Link href="/contacto"
                            className="text-sm font-extrabold uppercase tracking-widest hover:text-gray-500 transition-colors">Contacto</Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-extrabold uppercase tracking-widest">
                        {user && role === 'admin' && (
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/20"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Tablero</span>
                            </Link>
                        )}
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-black/5 transition-colors cursor-pointer group"
                                >
                                    <div className="w-10 h-10 bg-white border-2 border-gray-100 text-black flex items-center justify-center">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-black transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 animate-fade-in py-3">
                                        <div className="px-8 py-5 border-b border-gray-50">
                                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2">Cuenta activa</p>
                                            <p className="text-lg font-rethink font-bold truncate text-black mb-0.5">
                                                {user.user_metadata?.full_name || "Usuario"}
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium truncate lowercase tracking-normal">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="py-2">
                                            {role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setMenuOpen(false)}
                                                    className="w-full text-left px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-gray-50 flex items-center gap-3 transition-colors border-l-4 border-red-600"
                                                >
                                                    Panel de Control
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-8 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="px-5 py-3 hover:text-gray-500 transition-colors hidden md:block">
                                Entrar
                            </Link>
                        )}
                        <a href="https://wa.me/573013700487"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 shadow-lg">
                            Cotizar
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}


