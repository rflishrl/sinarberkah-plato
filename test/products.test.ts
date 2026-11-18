import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/env/private', () => ({
	API_BASE_URL: 'http://localhost:4000',
	REVALIDATE_SECRET: ''
}));

vi.mock('$app/env/public', () => ({
	PUBLIC_MEDIA_PUBLIC_DOMAIN: '',
	PUBLIC_SITE_URL: 'http://localhost:3000'
}));

const { load: loadCart } = await import('../src/routes/cart/+page.server.js');
const { load: loadProduk } = await import('../src/routes/produk/+page.server.js');
const { load: loadProducts } = await import('../src/routes/products/+page.server.js');

describe('Route redirects (308)', () => {
	it('mengarahkan /cart ke /products dengan status 308', () => {
		try {
			loadCart({} as never);
			throw new Error('Harus melempar redirect');
		} catch (error: unknown) {
			const redirectError = error as { status?: number; location?: string };
			expect(redirectError.status).toBe(308);
			expect(redirectError.location).toBe('/products');
		}
	});

	it('mengarahkan /produk ke /products dengan status 308', () => {
		try {
			loadProduk({} as never);
			throw new Error('Harus melempar redirect');
		} catch (error: unknown) {
			const redirectError = error as { status?: number; location?: string };
			expect(redirectError.status).toBe(308);
			expect(redirectError.location).toBe('/products');
		}
	});
});

describe('products/+page.server.ts query parsing', () => {
	it('mempertahankan dan melakukan trim query q yang valid', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
			return new Response(
				JSON.stringify({ success: true, data: { items: [], pagination: { totalPages: 1 } } }),
				{
					status: 200,
					headers: { 'content-type': 'application/json' }
				}
			);
		});

		const result = await loadProducts({
			url: new URL('http://localhost/products?q=%20%20pagar%20minimalis%20%20')
		} as never);
		expect(result).toEqual({ products: [], initialQuery: 'pagar minimalis' });

		const tooLong = await loadProducts({
			url: new URL(`http://localhost/products?q=${'a'.repeat(105)}`)
		} as never);
		expect(tooLong).toEqual({ products: [], initialQuery: '' });

		fetchMock.mockRestore();
	});
});
