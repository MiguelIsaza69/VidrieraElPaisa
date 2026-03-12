"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReloadButtonProps {
    className?: string;
    showText?: boolean;
    variant?: "icon" | "full";
}

export default function ReloadButton({ 
    className = "", 
    showText = false,
    variant = "icon"
}: ReloadButtonProps) {
    const router = useRouter();
    const [isReloading, setIsReloading] = useState(false);

    const handleReload = () => {
        setIsReloading(true);
        // router.refresh() invalidates the client-side cache for the current route
        router.refresh();
        // window.location.reload() performs a full page reload from the network (if possible)
        window.location.reload();
    };

    if (variant === "full") {
        return (
            <button
                onClick={handleReload}
                disabled={isReloading}
                className={`bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all shadow-lg disabled:opacity-50 ${className}`}
            >
                <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
                <span>{isReloading ? 'Recargando...' : 'Recargar Datos'}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleReload}
            disabled={isReloading}
            className={`flex items-center gap-2 p-2 hover:bg-black/5 transition-colors group rounded-full ${className}`}
            title="Recargar página y limpiar caché"
        >
            <RefreshCw className={`w-4 h-4 text-black transition-transform group-hover:rotate-180 ${isReloading ? 'animate-spin' : ''}`} />
            {showText && <span className="text-[10px] font-black uppercase tracking-widest">Recargar</span>}
        </button>
    );
}
