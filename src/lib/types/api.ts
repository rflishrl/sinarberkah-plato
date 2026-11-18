import { z } from 'zod';

import { isAllowedMediaUrl } from '#lib/media-url.js';

const allowedImageUrlSchema = z
	.string()
	.refine((value) => value === '' || isAllowedMediaUrl(value), {
		message: 'Host URL media tidak diizinkan.'
	});

const apiImageSchema = z.object({
	image_url: allowedImageUrlSchema,
	thumb_url: allowedImageUrlSchema.optional()
});

/** Item galeri dan portofolio dikembalikan API dengan bentuk yang sama. */
export const galleryItemSchema = z.object({
	_id: z.string(),
	title: z.string(),
	type: z.string(),
	description: z.string(),
	image: apiImageSchema
});

export const articleSchema = z.object({
	_id: z.string(),
	title: z.string(),
	category: z.string(),
	content: z.string(),
	createdAt: z.string(),
	image: apiImageSchema
});

export const productSchema = z.object({
	_id: z.string(),
	name: z.string(),
	category: z.string(),
	description: z.string(),
	price: z.number(),
	image: apiImageSchema,
	isActive: z.boolean()
});

export const listResponseSchema = z.object({
	success: z.literal(true),
	data: z.object({
		items: z.array(z.unknown()),
		pagination: z.object({ totalPages: z.number().int().nonnegative() })
	})
});

export type ApiImage = z.infer<typeof apiImageSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type PortfolioItem = GalleryItem;
export type Article = z.infer<typeof articleSchema>;
export type Product = z.infer<typeof productSchema>;

export interface HeroSlide {
	id: string;
	title: string;
	description: string;
	ctaLabel: string;
	ctaHref: string;
	image: { src: string; alt: string };
}

export type ServiceIconName = 'cutting' | 'las' | 'sketsel';

export interface Service {
	id: string;
	icon: ServiceIconName;
	title: string;
	description: string;
}

export interface Material {
	name: string;
	thickness: string;
	notes: string[];
}

export type PatternSlide =
	| { id: string; kind: 'image'; src: string; thumbSrc?: string; alt: string }
	| { id: string; kind: 'strip'; src: string; alt: string };
