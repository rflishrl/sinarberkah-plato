import { API_BASE_URL } from '$app/env/private';
import { z } from 'zod';

import {
	type Article,
	articleSchema,
	type GalleryItem,
	galleryItemSchema,
	listResponseSchema,
	type PortfolioItem,
	type Product,
	productSchema
} from '#lib/types/api.js';

export function getApiBaseUrl(): string {
	const configured = (API_BASE_URL || process.env.API_BASE_URL || '').trim();
	if (configured) return configured.replace(/\/$/, '');
	if (process.env.NODE_ENV === 'production') {
		throw new ApiError('API_BASE_URL belum diisi. Variabel ini wajib di produksi.');
	}
	return 'http://localhost:4000';
}

export const CACHE_TAGS = {
	portfolio: 'portfolio',
	gallery: 'gallery',
	products: 'products',
	articles: 'articles'
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const REQUEST_TIMEOUT_MS = 6_000;
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 500;
const LIST_LIMIT = 100;
const MAX_PAGES = 10;

export class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

class PermanentError extends ApiError {}

const legacyEnvelopeSchema = z.object({
	data: z.array(z.unknown()),
	meta: z.object({ totalPages: z.number().int().nonnegative() }).optional()
});

function readEnvelope(body: unknown): { items: unknown[]; totalPages: number } | null {
	const current = listResponseSchema.safeParse(body);
	if (current.success) {
		return {
			items: current.data.data.items,
			totalPages: current.data.data.pagination.totalPages
		};
	}
	const legacy = legacyEnvelopeSchema.safeParse(body);
	if (legacy.success) {
		return {
			items: legacy.data.data,
			totalPages: legacy.data.meta?.totalPages ?? 1
		};
	}
	return null;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestJson(path: string, _tag: CacheTag): Promise<unknown> {
	void _tag;
	const baseUrl = getApiBaseUrl();
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		try {
			const response = await fetch(`${baseUrl}${path}`, {
				signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
			});

			if (response.ok) return await response.json();

			const message = `HTTP ${response.status}`;
			if (response.status < 500 && response.status !== 429) {
				throw new PermanentError(message);
			}
			lastError = new ApiError(message);
		} catch (error) {
			if (error instanceof PermanentError) throw error;
			lastError = error;
		}

		if (attempt < MAX_ATTEMPTS) await wait(RETRY_DELAY_MS);
	}

	const reason = lastError instanceof Error ? lastError.message : String(lastError);
	throw new ApiError(`Gagal memuat ${path}: ${reason}`);
}

async function fetchList<T>(
	path: string,
	tag: CacheTag,
	schema: z.ZodType<T>,
	options?: { limit?: number; maxPages?: number }
): Promise<T[]> {
	const items: T[] = [];
	const limit = options?.limit ?? LIST_LIMIT;
	const maxPages = options?.maxPages ?? MAX_PAGES;

	for (let page = 1; page <= maxPages; page++) {
		const pagePath = `${path}?limit=${limit}&page=${page}`;
		const envelope = readEnvelope(await requestJson(pagePath, tag));
		if (!envelope) {
			throw new ApiError(`Bentuk respons ${pagePath} tidak dikenali.`);
		}

		for (const raw of envelope.items) {
			const parsed = schema.safeParse(raw);
			if (parsed.success) {
				items.push(parsed.data);
			} else {
				console.error(`[api] Item dari ${path} dilewati: data tidak valid.`);
			}
		}

		if (page >= envelope.totalPages) return items;
	}

	console.error(`[api] ${path} punya lebih dari ${maxPages} halaman; sisanya tidak dimuat.`);
	return items;
}

export function getPortfolio(options?: {
	limit?: number;
	maxPages?: number;
}): Promise<PortfolioItem[]> {
	return fetchList('/api/gallery/v1/portfolio', CACHE_TAGS.portfolio, galleryItemSchema, options);
}

export function getGallery(options?: {
	limit?: number;
	maxPages?: number;
}): Promise<GalleryItem[]> {
	return fetchList('/api/gallery/v1', CACHE_TAGS.gallery, galleryItemSchema, options);
}

export function getProducts(): Promise<Product[]> {
	return fetchList('/api/products/v1', CACHE_TAGS.products, productSchema);
}

export function getArticles(): Promise<Article[]> {
	return fetchList('/api/article/v1', CACHE_TAGS.articles, articleSchema);
}

async function safeFetch<T>(fn: () => Promise<T[]>, label: string): Promise<T[]> {
	try {
		return await fn();
	} catch (error) {
		console.error(`[server-load] Gagal memuat ${label}:`, error);
		return [];
	}
}

export const fetchPortfolio = () => safeFetch(() => getPortfolio(), 'portofolio');
export const fetchHomePortfolio = () =>
	safeFetch(() => getPortfolio({ limit: 6, maxPages: 1 }), 'portofolio beranda');
export const fetchGallery = () => safeFetch(() => getGallery(), 'galeri');
export const fetchHomeGallery = () =>
	safeFetch(() => getGallery({ limit: 12, maxPages: 1 }), 'galeri beranda');
export const fetchProducts = () => safeFetch(() => getProducts(), 'produk');
export const fetchArticles = () => safeFetch(() => getArticles(), 'artikel');
