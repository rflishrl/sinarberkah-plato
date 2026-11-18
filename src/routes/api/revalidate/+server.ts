import { handleRevalidate } from '#lib/server/revalidate.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	return handleRevalidate(request);
};
