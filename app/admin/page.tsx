"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { sileo } from "sileo";
import { Plus, Trash2, Edit3, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
    const [publications, setPublications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPub, setEditingPub] = useState<any>(null);

    // New pub form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Ventanería");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        fetchPublications();
    }, []);

    const fetchPublications = async () => {
        const { data } = await supabase
            .from("publications")
            .select("*, publication_images(*)")
            .order("created_at", { ascending: false });

        setPublications(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let imageUrl = "";

        // 1. Upload image if present
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `public/${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('publications')
                .upload(filePath, imageFile);

            if (uploadError) {
                sileo.error({ description: "Error al subir imagen" });
                setUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('publications')
                .getPublicUrl(filePath);

            imageUrl = publicUrl;
        }

        const pubData = {
            title,
            description,
            category,
        };

        let error;
        let pubId = editingPub?.id;

        if (editingPub) {
            const res = await supabase
                .from("publications")
                .update(pubData)
                .eq("id", editingPub.id);
            error = res.error;
        } else {
            const res = await supabase
                .from("publications")
                .insert([pubData])
                .select();
            error = res.error;
            if (res.data) pubId = res.data[0].id;
        }

        // 2. Save image URL if uploaded
        if (!error && imageUrl && pubId) {
            await supabase
                .from("publication_images")
                .insert([{ publication_id: pubId, url: imageUrl }]);
        }

        if (error) {
            sileo.error({ description: "Error al guardar publicación" });
        } else {
            sileo.success({ description: "Publicación guardada" });
            setShowModal(false);
            resetForm();
            fetchPublications();
        }
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Eliminar esta publicación?")) return;

        const { error } = await supabase
            .from("publications")
            .delete()
            .eq("id", id);

        if (error) {
            sileo.error({ description: "Error al eliminar" });
        } else {
            sileo.success({ description: "Eliminado" });
            fetchPublications();
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("Ventanería");
        setEditingPub(null);
    };

    if (loading && publications.length === 0) return <div>Cargando dashboard...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-light">Gestión de Contenido</h1>
                    <p className="text-gray-500 text-sm mt-1">Crea y modifica las publicaciones del sitio</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-black text-white px-6 py-3 rounded-none text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Nueva Publicación
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {publications.map((pub) => (
                    <div key={pub.id} className="bg-white border border-gray-100 p-6 flex flex-col group">
                        <div className="aspect-video bg-gray-100 mb-4 overflow-hidden relative">
                            {pub.publication_images?.[0] ? (
                                <img src={pub.publication_images[0].url} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{pub.category}</span>
                        <h3 className="font-bold text-lg mb-2">{pub.title}</h3>
                        <p className="text-gray-500 text-sm font-light flex-grow line-clamp-2">{pub.description}</p>

                        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-50">
                            <button
                                onClick={() => { setEditingPub(pub); setTitle(pub.title); setDescription(pub.description); setCategory(pub.category); setShowModal(true); }}
                                className="text-xs font-bold uppercase tracking-tighter flex items-center gap-1 hover:text-black transition-colors text-gray-400"
                            >
                                <Edit3 className="w-3 h-3" /> Editar
                            </button>
                            <button
                                onClick={() => handleDelete(pub.id)}
                                className="text-xs font-bold uppercase tracking-tighter flex items-center gap-1 hover:text-red-500 transition-colors text-gray-400 ml-auto"
                            >
                                <Trash2 className="w-3 h-3" /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg p-10 animate-reveal-up">
                        <h2 className="text-2xl font-light mb-8">{editingPub ? 'Editar Publicación' : 'Nueva Publicación'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Título</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Categoría</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light"
                                >
                                    <option>Ventanería</option>
                                    <option>Pasamanos</option>
                                    <option>Cabinas de Baño</option>
                                    <option>Espejos</option>
                                    <option>Fachadas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-black outline-none transition-colors font-light min-h-[120px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-black file:text-white hover:file:bg-gray-800 transition-all cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-grow bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 border border-black text-sm font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
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
