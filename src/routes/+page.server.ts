import { fetchHomeGallery, fetchHomePortfolio } from '#lib/server/api.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		portfolioPromise: fetchHomePortfolio(),
		galleryPromise: fetchHomeGallery()
	};
};
