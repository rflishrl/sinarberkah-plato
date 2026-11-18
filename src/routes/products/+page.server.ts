import { z } from 'zod';

import { fetchProducts } from '#lib/server/api.js';
import type { PageServerLoad } from './$types';

const productSearchSchema = z.object({
	q: z.string().trim().max(100).default('').catch('')
});

export const load: PageServerLoad = async ({ url }) => {
	const parsed = productSearchSchema.parse({ q: url.searchParams.get('q') ?? '' });
	const products = await fetchProducts();
	return {
		products,
		initialQuery: parsed.q
	};
};
