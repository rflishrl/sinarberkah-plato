import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SECRET = 'rahasia-revalidate-uji';
const mockEnv = vi.hoisted(() => ({
	REVALIDATE_SECRET: ''
}));

vi.mock('$app/env/private', () => ({
	API_BASE_URL: 'http://localhost:4000',
	get REVALIDATE_SECRET() {
		return mockEnv.REVALIDATE_SECRET;
	}
}));

const { handleRevalidate } = await import('#lib/server/revalidate.js');
const originalSecret = process.env.REVALIDATE_SECRET;

const call = (body: unknown, authorization = `Bearer ${SECRET}`) =>
	handleRevalidate(
		new Request('http://localhost/api/revalidate', {
			method: 'POST',
			headers: { authorization, 'content-type': 'application/json' },
			body: typeof body === 'string' ? body : JSON.stringify(body)
		})
	);

beforeEach(() => {
	mockEnv.REVALIDATE_SECRET = SECRET;
	process.env.REVALIDATE_SECRET = SECRET;
});

afterEach(() => {
	mockEnv.REVALIDATE_SECRET = '';
	if (originalSecret === undefined) {
		delete process.env.REVALIDATE_SECRET;
	} else {
		process.env.REVALIDATE_SECRET = originalSecret;
	}
});

describe('POST /api/revalidate', () => {
	it('503 jika REVALIDATE_SECRET belum diisi', async () => {
		mockEnv.REVALIDATE_SECRET = '';
		delete process.env.REVALIDATE_SECRET;
		expect((await call({ tags: ['gallery'] })).status).toBe(503);
	});

	it('401 jika rahasia salah', async () => {
		const response = await call({ tags: ['gallery'] }, 'Bearer salah');
		expect(response.status).toBe(401);
	});

	it('400 jika body tidak valid', async () => {
		expect((await call('{rusak')).status).toBe(400);
		expect((await call({ tags: [] })).status).toBe(400);
	});

	it('hanya membuang tag yang dikenal', async () => {
		const response = await call({ tags: ['gallery', 'tidak-dikenal'] });
		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({
			revalidated: ['gallery']
		});
	});
});
