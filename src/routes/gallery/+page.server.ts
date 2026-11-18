import { fetchGallery } from '#lib/server/api.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		items: await fetchGallery()
	};
};
