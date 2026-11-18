import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { articleSchema, galleryItemSchema, productSchema } from '#lib/types/api.js';

const baseUrl = process.env.CONTRACT_API_URL?.trim().replace(/\/$/, '');

const endpoints: [path: string, schema: z.ZodType][] = [
	['/api/products/v1', productSchema],
	['/api/gallery/v1/portfolio', galleryItemSchema],
	['/api/gallery/v1', galleryItemSchema],
	['/api/article/v1', articleSchema]
];

describe.skipIf(!baseUrl)('kontrak API backend', () => {
	it.each(endpoints)('%s cocok dengan skema frontend', async (path, schema) => {
		const response = await fetch(`${baseUrl}${path}?limit=100`);
		expect(response.status).toBe(200);

		const envelope = z.object({
			success: z.literal(true),
			data: z.object({
				items: z.array(schema),
				pagination: z.object({ totalPages: z.number().int().nonnegative() })
			})
		});
		const result = envelope.safeParse(await response.json());
		if (!result.success) {
			throw new Error(result.error.message);
		}
		expect(result.success).toBe(true);
	});
});
