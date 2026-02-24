"use client";

import { Grid, FileText, Eye, Building2 } from "lucide-react";
import Link from "next/link";

const services = [
    {
        title: "Vidrio Arquitectónico",
        description: "Laminados y templados de máxima seguridad para fachadas y divisiones.",
        icon: <Grid className="w-6 h-6" />,
    },
    {
        title: "Aluminio & Perfilería",
        description: "Sistemas de ventanería acústica y estructural con acabados premium.",
        icon: <FileText className="w-6 h-6" />,
    },
    {
        title: "Espejos & Decoración",
        description: "Espejos flotantes con iluminación LED integrada y formas personalizadas.",
        icon: <Eye className="w-6 h-6" />,
    },
    {
        title: "Cabinas de Baño",
        description: "Minimalismo puro en su baño con vidrio templado de seguridad.",
        icon: <Building2 className="w-6 h-6" />,
    },
];

export default function Services() {
    return (
        <section id="servicios" className="py-24 bg-paisa-light-gray/30">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-10 hover-lift group border border-transparent hover:border-gray-200 transition-all"
                        >
                            <div className="w-12 h-12 bg-gray-100 mb-6 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-500 font-light text-sm leading-6">{service.description}</p>
                        </div>
                    ))}

                    <div
                        className="bg-black text-white p-10 flex flex-col justify-center items-start md:col-span-2 lg:col-span-2"
                    >
                        <h3 className="text-2xl font-light mb-4">¿Tiene un proyecto en mente?</h3>
                        <p className="text-gray-400 mb-8 max-w-md font-light text-sm">
                            Desde marquetería especializada hasta grandes fachadas comerciales.
                        </p>
                        <a href="https://wa.me/573013700487"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all">
                            Solicitar Asesoría &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
