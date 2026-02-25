"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Portfolio() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 3;

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // Fetch total count
            const { count } = await supabase
                .from("publications")
                .select("*", { count: 'exact', head: true });

            setTotalCount(count || 0);

            // Fetch page items
            const from = currentPage * pageSize;
            const to = from + pageSize - 1;

            const { data } = await supabase
                .from("publications")
                .select("*, publication_images(*)")
                .order("created_at", { ascending: false })
                .range(from, to);

            setProjects(data || []);
            setLoading(false);
        };

        fetchData();
    }, [supabase, currentPage]);

    const totalPages = Math.ceil(totalCount / pageSize);

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    if (loading && projects.length === 0) return (
        <div className="py-24 text-center">
            <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin mx-auto"></div>
        </div>
    );

    return (
        <section id="portafolio" className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Nuestro Trabajo</span>
                    <h2 className="text-4xl font-light mt-2">Detalles que inspiran</h2>
                </div>

                <div className="flex items-center gap-6">
                    {totalPages > 1 && (
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Página <span className="text-black">{currentPage + 1}</span> de {totalPages}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 0}
                            className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentPage >= totalPages - 1}
                            className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-black">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {projects.map((project) => (
                    <div key={project.id} className="group cursor-pointer">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                            <img src={project.publication_images?.[0]?.url || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt={project.title} />
                        </div>
                        <h4 className="text-xl font-rethink font-bold tracking-tight">{project.title}</h4>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">{project.category}</p>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <p className="text-center text-gray-400 font-light italic">No hay proyectos publicados aún.</p>
            )}
        </section>
    );
}
