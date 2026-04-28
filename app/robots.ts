import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidrieraelpaisa.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/perfil', '/login', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
