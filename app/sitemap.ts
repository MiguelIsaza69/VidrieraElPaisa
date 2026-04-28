import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  // Verificamos que las credenciales de Supabase existan para evitar fallos en el build
  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // 1. Extraemos las categorías para generar URLs con query params (la forma actual de filtrar el catálogo)
      const { data: categories } = await supabase.from('service_categories').select('name');
      
      if (categories && categories.length > 0) {
        const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
          url: `${baseUrl}/catalogo?servicio=${encodeURIComponent(cat.name)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        dynamicRoutes = [...dynamicRoutes, ...categoryRoutes];
      }

      // 2. Extraemos los IDs de los productos para prever soporte de rutas dinámicas (ej: /catalogo/[id])
      const { data: publications } = await supabase.from('publications').select('id, updated_at');
      
      if (publications && publications.length > 0) {
        const publicationRoutes: MetadataRoute.Sitemap = publications.map((pub) => ({
          url: `${baseUrl}/catalogo/${pub.id}`,
          lastModified: pub.updated_at ? new Date(pub.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        }));
        dynamicRoutes = [...dynamicRoutes, ...publicationRoutes];
      }
    } catch (error) {
      console.error('Error fetching data for sitemap:', error);
    }
  }

  return [...staticRoutes, ...dynamicRoutes];
}
