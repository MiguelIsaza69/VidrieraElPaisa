"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Portfolio() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProjects = async () => {
            const { data } = await supabase
                .from("publications")
                .select("*, publication_images(*)")
                .order("created_at", { ascending: false })
                .limit(6);

            setProjects(data || []);
            setLoading(false);
        };

        fetchProjects();
    }, [supabase]);

    if (loading && projects.length === 0) return null;

    return (
        <section id="portafolio" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Nuestro Trabajo</span>
                    <h2 className="text-4xl font-light mt-2">Detalles que inspiran</h2>
                </div>
                <div className="hidden md:flex gap-2">
                    <button
                        className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div key={project.id} className="group cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <img src={project.publication_images?.[0]?.url || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={project.title} />
                        </div>
                        <h4 className="text-lg font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-500">{project.category}</p>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <p className="text-center text-gray-400 font-light italic">No hay proyectos publicados aún.</p>
            )}
        </section>
    );
}
