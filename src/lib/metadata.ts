import { siteConfig } from '#lib/data/site.js';
import { resolveMediaUrl } from '#lib/media-url.js';

interface PageHeadInput {
	title: string;
	description: string;
	path: string;
	image?: { url: string; width: number; height: number; alt?: string };
	noIndex?: boolean;
}

export interface HeadMeta {
	title: string;
	description: string;
	canonicalUrl: string;
	imageUrl: string;
	imageWidth: string;
	imageHeight: string;
	noIndex: boolean;
}

const defaultImage = {
	url: '/images/hero-1.png',
	width: 1148,
	height: 770,
	alt: 'Pekerja bengkel Sinar Berkah memotong plat besi'
};

/** Mengubah path lokal menjadi URL absolut. URL yang sudah absolut dibiarkan. */
export function absoluteUrl(src: string): string {
	if (/^https?:\/\//i.test(src)) return src;
	return new URL(src, siteConfig.url).toString();
}

export function buildHeadMeta({
	title,
	description,
	path,
	image = defaultImage,
	noIndex = false
}: PageHeadInput): HeadMeta {
	const pageTitle = title
		? `${title} | ${siteConfig.name}`
		: `${siteConfig.name} | ${siteConfig.tagline}`;
	const canonicalUrl = `${siteConfig.url}${path === '/' ? '' : path}`;
	const safeImageUrl = resolveMediaUrl(image.url, {
		variant: 'full',
		fallback: defaultImage.url
	});
	const imageUrl = absoluteUrl(safeImageUrl);

	return {
		title: pageTitle,
		description,
		canonicalUrl,
		imageUrl,
		imageWidth: String(image.width),
		imageHeight: String(image.height),
		noIndex
	};
}
