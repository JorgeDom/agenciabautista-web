// sitemap.xml for the one-page site, generated at build time from `site` (SITE_URL or the real domain).
// lastmod is the build date, so each deploy tells search engines the page changed.
import type { APIRoute } from 'astro';

const pages = ['/'];

export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map(p => `  <url>\n    <loc>${new URL(p, site).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
