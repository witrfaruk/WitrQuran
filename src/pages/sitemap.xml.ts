import type { APIRoute } from 'astro';
import surahsData from '../data/surahs.json';
import type { Surah } from '../types/surah';

export const GET: APIRoute = () => {
  const surahs = surahsData as Surah[];
  const baseUrl = 'https://witrquran.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/surahs', priority: '0.9', changefreq: 'daily' },
    { url: '/tools', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/zakat-calculator', priority: '0.9', changefreq: 'weekly' },
    { url: '/tools/prayer-times', priority: '0.9', changefreq: 'daily' },
    { url: '/tools/qibla-finder', priority: '0.9', changefreq: 'monthly' },
    { url: '/tools/hijri-converter', priority: '0.9', changefreq: 'daily' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/founder', priority: '0.7', changefreq: 'monthly' },
    { url: '/open-source', priority: '0.8', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly' },
    { url: '/terms', priority: '0.5', changefreq: 'monthly' },
    { url: '/cookies', priority: '0.5', changefreq: 'monthly' },
    { url: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
    { url: '/copyright', priority: '0.5', changefreq: 'monthly' },
    { url: '/report-error', priority: '0.6', changefreq: 'monthly' },
  ];

  const staticXml = staticPages
    .map(
      (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  const surahXml = surahs
    .map(
      (surah) => `  <url>
    <loc>${baseUrl}/surah/${surah.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${surahXml}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
