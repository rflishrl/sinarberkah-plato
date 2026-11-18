import { siteConfig } from '#lib/data/site.js';
import type { RequestHandler } from './$types';

const routes = ['', '/portfolio', '/gallery', '/products'];

export const GET: RequestHandler = () => {
	const urls = routes
		.map((route) => {
			const loc = `${siteConfig.url}${route}`;
			const freq = route === '' ? 'weekly' : 'monthly';
			const priority = route === '' ? '1.0' : '0.7';
			return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
