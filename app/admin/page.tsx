"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { Plus, Trash2, Edit3, Image as ImageIcon, LayoutDashboard, Send, Star } from "lucide-react";

type Tab = "publications" | "hero" | "reviews";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("publications");
    const [publications, setPublications] = useState<any[]>([]);
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Ventanería");
    const [slogan, setSlogan] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrlInput, setImageUrlInput] = useState(""); // Nuevo estado para URL manual
    const [uploading, setUploading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        console.log(`Cargando datos para pestaña: ${activeTab}...`);

        try {
            if (activeTab === "publications") {
                const { data, error } = await supabase
                    .from("publications")
                    .select("*, publication_images(*)")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setPublications(data || []);
            } else if (activeTab === "hero") {
                const { data, error } = await supabase
                    .from("hero_slides")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setHeroSlides(data || []);
            } else {
                const { data, error } = await supabase
                    .from("reviews")
                    .select("*, profiles(full_name)")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                setReviews(data || []);
            }
            console.log("Datos cargados con éxito.");
        } catch (err: any) {
            console.error("Error cargando datos en Admin:", err);
            sileo.error({ description: `No se pudieron cargar los datos: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImage = async () => {
        if (!imageFile) return "";
        try {
            console.log("Iniciando proceso de upload en Supabase...");
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Añadimos un aviso si el archivo es muy grande
            if (imageFile.size > 5 * 1024 * 1024) {
                console.warn("Archivo grande detectado (>5MB)");
            }

            const { data, error: uploadError } = await supabase.storage
                .from('publications')
                .upload(filePath, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Error devuelto por Supabase Storage:", uploadError);
                return null;
            }

            console.log("Upload exitoso, obteniendo URL pública...");
            const { data: { publicUrl } } = supabase.storage
                .from('publications')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (err) {
            console.error("Error excepcional en handleUploadImage:", err);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        console.log("--- Iniciando proceso de guardado ---");

        try {
            let finalImageUrl = imageUrlInput;

            // SI HAY UN LINK Y UN ARCHIVO, PRIORIZAMOS EL LINK PARA EVITAR HANGS
            if (imageFile && !imageUrlInput) {
                console.log("Intentando subir archivo porque no hay URL manual...");
                const uploadedUrl = await handleUploadImage();
                if (uploadedUrl === null) {
                    sileo.error({
                        description: "La subida falló. Intenta pegar la URL de la imagen directamente."
                    });
                    setUploading(false);
                    return;
                }
                finalImageUrl = uploadedUrl;
            } else if (imageUrlInput) {
                console.log("Usando URL manual proporcionada, saltando subida de archivo.");
                finalImageUrl = imageUrlInput;
            }

            if (!finalImageUrl && !editingItem) {
                sileo.error({ description: "Debes subir una imagen o proporcionar una URL" });
                setUploading(false);
                return;
            }

            if (activeTab === "publications") {
                console.log("Enviando datos a tabla 'publications'...");
                const pubData: any = { title, description, category };
                let error;
                let pubId = editingItem?.id;

                if (editingItem) {
                    const res = await supabase.from("publications").update(pubData).eq("id", editingItem.id);
                    error = res.error;
                } else {
                    const res = await supabase.from("publications").insert([pubData]).select();
                    error = res.error;
                    if (res.data) pubId = res.data[0].id;
                }

                if (!error && finalImageUrl && pubId) {
                    const resImg = await supabase.from("publication_images").insert([{ publication_id: pubId, url: finalImageUrl }]);
                    if (resImg.error) console.error("Error al insertar imagen en catálogo:", resImg.error);
                }

                if (error) throw error;

                sileo.success({ description: "Publicación guardada correctamente" });
                setShowModal(false);
                resetForm();
                fetchData();
            } else if (activeTab === "hero") {
                console.log("Enviando datos a tabla 'hero_slides'...");
                if (heroSlides.length >= 6 && !editingItem) {
                    sileo.error({ description: "Máximo 6 slides permitidos" });
                    setUploading(false);
                    return;
                }

                const slideData: any = { title, description, slogan, image_url: finalImageUrl };

                let error;
                if (editingItem) {
                    const res = await supabase.from("hero_slides").update(slideData).eq("id", editingItem.id);
                    error = res.error;
                } else {
                    const res = await supabase.from("hero_slides").insert([slideData]);
                    error = res.error;
                }

                if (error) throw error;

                sileo.success({ description: "Slide guardado correctamente" });
                setShowModal(false);
                resetForm();
                fetchData();
            }
        } catch (error: any) {
            console.error("ERROR DETECTADO:", error);
            sileo.error({ description: `Error: ${error.message || 'No se pudo conectar con la base de datos'}` });
        } finally {
            setUploading(false);
            console.log("--- Fin del proceso ---");
        }
    };

    const handleDelete = async (id: string) => {
        let table = "";
        if (activeTab === "publications") table = "publications";
        else if (activeTab === "hero") table = "hero_slides";
        else table = "reviews";

        const { error } = await supabase.from(table).delete().eq("id", id);

        if (error) {
            sileo.error({ description: "Error al eliminar" });
        } else {
            sileo.success({ description: "Eliminado con éxito" });
            fetchData();
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("Ventanería");
        setSlogan("");
        setImageFile(null);
        setImageUrlInput("");
        setEditingItem(null);
    };

    const openEdit = (item: any) => {
        setEditingItem(item);
        setTitle(item.title);
        setDescription(item.description);
        if (activeTab === "publications") {
            setCategory(item.category);
        } else {
            setSlogan(item.slogan || "");
            setImageUrlInput(item.image_url || "");
        }
        setShowModal(true);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-8 md:p-12 pt-0 md:pt-0 font-geist">
            <div className="max-w-7xl mx-auto">
                <div className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md pt-10 md:pt-14 pb-10 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-gray-100 -mx-4 px-4 md:-mx-8 md:px-8">
                    {/* Lado Izquierdo: Título */}
                    <div className="flex-1 hidden md:block">
                        <h1 className="text-4xl font-rethink font-bold text-black tracking-tighter leading-none">Administración</h1>
                        <p className="text-gray-500 font-medium text-xs uppercase tracking-[0.2em] mt-3">Panel de Control</p>
                    </div>

                    {/* Centro: Tabs */}
                    <div className="flex bg-gray-200/50 p-1.5 rounded-none h-fit">
                        <button
                            onClick={() => setActiveTab("publications")}
                            className={`px-8 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'publications' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            Catálogo
                        </button>
                        <button
                            onClick={() => setActiveTab("hero")}
                            className={`px-8 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'hero' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            Hero Carousel
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`px-8 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            Opiniones
                        </button>
                    </div>

                    {/* Lado Derecho: Acción */}
                    <div className="flex-1 flex justify-end">
                        {activeTab !== "reviews" && (
                            <button
                                onClick={() => { resetForm(); setShowModal(true); }}
                                className="bg-black text-white min-w-[260px] px-10 py-5 text-xs font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-neutral-800 transition-all shadow-2xl"
                            >
                                <Plus className="w-4 h-4 shrink-0" />
                                <span>{activeTab === 'publications' ? 'Nueva Publicación' : 'Nuevo Slide'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {activeTab === "publications" && (
                            publications.length > 0 ? (
                                publications.map((pub) => (
                                    <ItemCard
                                        key={pub.id}
                                        title={pub.title}
                                        subtitle={pub.category}
                                        desc={pub.description}
                                        img={pub.publication_images?.[0]?.url}
                                        onEdit={() => openEdit(pub)}
                                        onDelete={() => handleDelete(pub.id)}
                                    />
                                ))
                            ) : (
                                <EmptyState message="No hay publicaciones en el catálogo" />
                            )
                        )}

                        {activeTab === "hero" && (
                            heroSlides.length > 0 ? (
                                heroSlides.map((slide) => (
                                    <ItemCard
                                        key={slide.id}
                                        title={slide.title}
                                        subtitle={`Slide`}
                                        desc={slide.description}
                                        badge={slide.slogan}
                                        img={slide.image_url}
                                        onEdit={() => openEdit(slide)}
                                        onDelete={() => handleDelete(slide.id)}
                                    />
                                ))
                            ) : (
                                <EmptyState message="No hay slides configurados" />
                            )
                        )}

                        {activeTab === "reviews" && (
                            reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="bg-white border-2 border-gray-50 p-8 flex flex-col group hover:border-black transition-all hover:shadow-2xl">
                                        <div className="flex items-center gap-2 mb-6">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                            ))}
                                            {[...Array(5 - (review.rating || 0))].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-gray-200" />
                                            ))}
                                        </div>
                                        <p className="text-gray-700 text-sm font-medium italic mb-6 leading-relaxed line-clamp-4">
                                            "{review.content}"
                                        </p>
                                        <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-black block mb-1">
                                                    {review.profiles?.full_name || "Usuario Anónimo"}
                                                </span>
                                                <span className="text-[8px] font-medium text-gray-400">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2"
                                                title="Eliminar Opinión"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <EmptyState message="No hay opiniones de clientes todavía" />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-2xl p-12 shadow-2xl relative animate-reveal-up overflow-y-auto max-h-[90vh]">
                        <h2 className="text-3xl font-rethink font-bold mb-10 text-black">
                            {editingItem ? 'Editar' : 'Crear'} {activeTab === 'publications' ? 'Publicación' : 'Slide de Hero'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-gray-50 border-0 p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                        placeholder="Ej: Ventana de Lujo"
                                        required
                                    />
                                </div>

                                {activeTab === "publications" ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoría</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-gray-50 border-0 p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                        >
                                            <option>Ventanería</option>
                                            <option>Pasamanos</option>
                                            <option>Cabinas de Baño</option>
                                            <option>Espejos</option>
                                            <option>Fachadas</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Slogan</label>
                                        <input
                                            type="text"
                                            value={slogan}
                                            onChange={(e) => setSlogan(e.target.value)}
                                            className="w-full bg-gray-50 border-0 p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all"
                                            placeholder="Frase corta llamativa"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-gray-50 border-0 p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all min-h-[100px]"
                                    placeholder="Detalles sobre el producto..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subir Archivo</label>
                                    <div className="relative group cursor-pointer h-[100px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className={`h-full border-2 border-dashed p-4 flex flex-col items-center justify-center transition-all ${imageFile ? 'border-black bg-gray-100' : 'border-gray-200 bg-gray-50 group-hover:border-black'}`}>
                                            <ImageIcon className={`w-6 h-6 mb-1 ${imageFile ? 'text-black' : 'text-gray-300 group-hover:text-black'}`} />
                                            <p className="text-[8px] font-black uppercase tracking-widest text-center truncate w-full">
                                                {imageFile ? imageFile.name : 'Click para subir'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">O pegar URL de imagen</label>
                                    <input
                                        type="url"
                                        value={imageUrlInput}
                                        onChange={(e) => setImageUrlInput(e.target.value)}
                                        className="w-full bg-gray-50 border-0 p-4 text-sm font-medium focus:ring-2 focus:ring-black outline-none transition-all h-[100px]"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    <p className="text-[8px] text-gray-400 italic">Ideal si el almacenamiento falla o usas imágenes externas.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-grow bg-black text-white py-5 text-xs font-black uppercase tracking-[0.4em] hover:bg-neutral-800 transition-all shadow-xl disabled:opacity-50"
                                >
                                    {uploading ? 'Guardando...' : 'Confirmar Cambios'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-10 border-2 border-black text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-100 animate-reveal-up">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mb-6">
                <ImageIcon className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium text-sm">{message}</p>
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-300 mt-2">Usa el botón superior para empezar</p>
        </div>
    );
}

function ItemCard({ title, subtitle, desc, img, badge, onEdit, onDelete }: any) {
    return (
        <div className="bg-white border-2 border-gray-50 p-8 flex flex-col group hover:border-black transition-all hover:shadow-2xl">
            <div className="aspect-[4/3] bg-gray-50 mb-6 overflow-hidden relative">
                {img ? (
                    <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={title} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                )}
                {badge && (
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em]">
                        {badge}
                    </div>
                )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 truncate">{subtitle}</span>
            <h3 className="font-rethink font-bold text-xl mb-3 text-black truncate">{title}</h3>
            <p className="text-gray-500 text-sm font-medium flex-grow line-clamp-3 leading-relaxed">{desc}</p>

            <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100">
                <button
                    onClick={onEdit}
                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-black transition-all text-gray-400"
                >
                    <Edit3 className="w-4 h-4" /> Editar
                </button>
                <button
                    onClick={onDelete}
                    className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-red-600 transition-all text-gray-400 ml-auto"
                >
                    <Trash2 className="w-4 h-4" /> Eliminar
                </button>
            </div>
        </div>
    );
}
