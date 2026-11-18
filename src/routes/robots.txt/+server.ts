import { siteConfig } from '#lib/data/site.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return new Response(`User-agent: *\nAllow: /\nSitemap: ${siteConfig.url}/sitemap.xml\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400'
		}
	});
};
