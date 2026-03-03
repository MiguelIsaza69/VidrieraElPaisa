"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Grid, FileText, Eye, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const serviceIcons: Record<string, any> = {
    "Vidrio Arquitectónico": <Grid className="w-5 h-5" />,
    "Aluminio & Perfilería": <FileText className="w-5 h-5" />,
    "Espejos & Decoración": <Eye className="w-5 h-5" />,
    "Divisiones & Baños": <Building2 className="w-5 h-5" />,
};

function CatalogContent() {
    const searchParams = useSearchParams();
    const initialServiceName = searchParams.get("servicio");

    const [publications, setPublications] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showReloadButton, setShowReloadButton] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    const supabase = createClient();

    // 0. Determinar items por página según el tamaño de pantalla
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width >= 1024) setItemsPerPage(12);      // Desktop: 3 columnas, 4 filas = 12
            else if (width >= 768) setItemsPerPage(8);   // Tablet: 2 columnas, 4 filas = 8
            else setItemsPerPage(4);                    // Móvil: 1 columna, 4 filas = 4
        };

        updateItemsPerPage();
        window.addEventListener("resize", updateItemsPerPage);
        return () => window.removeEventListener("resize", updateItemsPerPage);
    }, []);

    // 1. Cargar las categorías primero
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from("service_categories").select("*");
            if (error) {
                console.error("Error fetching categories:", error);
            } else {
                setCategories(data || []);
                // Si venimos con un nombre de servicio por URL, buscar su ID
                if (initialServiceName) {
                    const matched = data?.find((c: any) => c.name === initialServiceName);
                    if (matched) setSelectedCategoryId(matched.id);
                }
            }
        };
        fetchCategories();
    }, [initialServiceName, supabase]);

    // 2. Cargar las publicaciones cuando cambie la categoría seleccionada
    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);
            let query = supabase
                .from("publications")
                .select("*, publication_images(*), service_categories(name)")
                .order("created_at", { ascending: false });

            if (selectedCategoryId) {
                query = query.eq("service_category_id", selectedCategoryId);
            }

            const { data, error } = await query;
            if (error) {
                console.error("Error fetching catalog:", error);
            } else {
                setPublications(data || []);
                setCurrentPage(1); // Reset to first page on new filter
            }
            setLoading(false);
        };

        if (categories.length > 0 || !selectedCategoryId) {
            fetchCatalog();
        }
    }, [selectedCategoryId, supabase, categories]);

    // 3. Temporizador para mostrar botón de recarga si tarda demasiado
    useEffect(() => {
        let timer: any;
        if (loading) {
            timer = setTimeout(() => {
                setShowReloadButton(true);
            }, 7000); // 7 segundos de espera
        } else {
            setShowReloadButton(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    const getSelectedCategoryName = () => {
        if (!selectedCategoryId) return "Todos nuestros productos";
        return categories.find(c => c.id === selectedCategoryId)?.name || "Catálogo";
    };

    // Pagination Logic
    const totalPages = Math.ceil(publications.length / itemsPerPage);
    const displayedPublications = publications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="mb-16">
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Catálogo Profesional</span>
                        <h1 className="text-5xl md:text-6xl font-rethink font-bold tracking-tighter mt-4 text-black">
                            {getSelectedCategoryName()}
                        </h1>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <button
                            onClick={() => setSelectedCategoryId(null)}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border ${!selectedCategoryId ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategoryId === cat.id ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                            >
                                {serviceIcons[cat.name] || <Grid className="w-5 h-5" />}
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Cargando catálogo...</p>
                            {showReloadButton && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-8 py-3 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all animate-fade-in"
                                >
                                    ¡Parece que tarda un poco! ¿Quieres recargar la página?
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {displayedPublications.map((pub) => (
                                    <div key={pub.id} className="group flex flex-col">
                                        <div className="aspect-[4/5] bg-gray-50 mb-8 overflow-hidden relative">
                                            <img
                                                src={pub.publication_images?.[0]?.url || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"}
                                                alt={pub.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                                <span className="bg-white/90 backdrop-blur-md text-black px-4 py-1.5 text-[8px] font-black uppercase tracking-widest shadow-sm">
                                                    {pub.service_categories?.name}
                                                </span>
                                                <span className="bg-black text-white px-4 py-1.5 text-[8px] font-black uppercase tracking-widest shadow-sm">
                                                    {pub.category}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-rethink font-bold tracking-tight text-black mb-3">{pub.title}</h3>
                                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 line-clamp-3">
                                            {pub.description}
                                        </p>
                                        <a
                                            href={`https://wa.me/573013700487?text=${encodeURIComponent(
                                                `Hola, Vidriera El Paisa. \nMe gustaria recibir mas informacion y asesoria sobre este producto del Catalogo Profesional:\n\nPRODUCTO: *${pub.title}*\nCATEGORIA: *${pub.service_categories?.name}*\n\n¿Podrian darme detalles de disponibilidad? Muchas gracias.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform"
                                        >
                                            Consultar disponibilidad &rarr;
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination UI */}
                            {totalPages > 1 && (
                                <div className="mt-20 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-12 h-12 flex items-center justify-center border border-gray-100 hover:border-black transition-all disabled:opacity-30 disabled:hover:border-gray-100"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-12 h-12 flex items-center justify-center text-[10px] font-black border transition-all ${currentPage === i + 1 ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="w-12 h-12 flex items-center justify-center border border-gray-100 hover:border-black transition-all disabled:opacity-30 disabled:hover:border-gray-100"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!loading && publications.length === 0 && (
                        <div className="text-center py-32 bg-gray-50 border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-medium text-lg mb-2">No se encontraron productos en esta categoría.</p>
                            <button
                                onClick={() => setSelectedCategoryId(null)}
                                className="text-xs font-black uppercase tracking-widest underline hover:text-black transition-colors"
                            >
                                Ver todo el catálogo
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin"></div>
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}
