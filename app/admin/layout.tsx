import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-black text-white py-4 px-6 fixed w-full z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="font-bold tracking-tight">ADMIN PANEL</span>
                    <div className="flex gap-6 text-xs uppercase tracking-widest font-bold">
                        <a href="/admin" className="hover:text-paisa-silver transition-colors">Publicaciones</a>
                        <a href="/admin/opiniones" className="hover:text-paisa-silver transition-colors">Opiniones</a>
                        <a href="/" className="hover:text-paisa-silver transition-colors">Ver Sitio</a>
                    </div>
                </div>
            </nav>
            <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    );
}
