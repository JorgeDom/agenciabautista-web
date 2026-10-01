import { defineConfig } from 'astro/config';

export default defineConfig({
  // Base URL for canonical and link-preview (og:image) URLs.
  // Until the real domain is connected, set SITE_URL in Cloudflare Pages to the
  // pages.dev address so previews work; delete it once agenciabautista.com.py is live.
  site: process.env.SITE_URL || 'https://agenciabautista.com.py',
});
