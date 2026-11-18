import fs from 'node:fs';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const SCREENSHOT_DIR = path.resolve('.baseline-screenshots/after');

async function attachErrorCollectors(page: Page) {
	const consoleErrors: string[] = [];
	const pageErrors: string[] = [];
	const serverErrors: string[] = [];

	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			consoleErrors.push(msg.text());
		}
	});
	page.on('pageerror', (err) => {
		pageErrors.push(err.message);
	});
	page.on('response', (res) => {
		if (res.status() >= 500) {
			serverErrors.push(`${res.status()} ${res.url()}`);
		}
	});

	return { consoleErrors, pageErrors, serverErrors };
}

async function waitForLoadedImages(page: Page) {
	await page.evaluate(async () => {
		const imgs = Array.from(document.querySelectorAll('img'));
		for (const img of imgs) {
			img.loading = 'eager';
			img.scrollIntoView({ behavior: 'instant', block: 'center' });
		}
		await Promise.all(
			imgs.map((img) => {
				if (img.complete) return Promise.resolve();
				return new Promise<void>((resolve) => {
					const timer = setTimeout(resolve, 6000);
					img.addEventListener(
						'load',
						() => {
							clearTimeout(timer);
							resolve();
						},
						{ once: true }
					);
					img.addEventListener(
						'error',
						() => {
							clearTimeout(timer);
							resolve();
						},
						{ once: true }
					);
				});
			})
		);
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
}

const ROUTES = [
	{ name: 'home', path: '/' },
	{ name: 'products', path: '/products' },
	{ name: 'portfolio', path: '/portfolio' },
	{ name: 'gallery', path: '/gallery' },
	{ name: 'article', path: '/article' }
];

test('all public routes render cleanly with SEO tags and 0 runtime errors', async ({ page }) => {
	const { consoleErrors, pageErrors, serverErrors } = await attachErrorCollectors(page);
	const captureScreenshots = process.env.CAPTURE_AFTER === '1';
	if (captureScreenshots) {
		fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
	}

	for (const route of ROUTES) {
		await page.setViewportSize({ width: 1440, height: 900 });
		const res = await page.goto(route.path, { waitUntil: 'load' });
		expect(res?.status()).toBe(200);
		await page.evaluate(() => document.fonts.ready);

		const title = await page.title();
		expect(title.length).toBeGreaterThan(3);

		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toBeTruthy();

		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical).toBeTruthy();

		const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
		expect(ogTitle).toBeTruthy();

		if (captureScreenshots) {
			await waitForLoadedImages(page);
			await page.screenshot({
				path: path.join(SCREENSHOT_DIR, `${route.name}-desktop.png`),
				fullPage: true
			});
			await page.setViewportSize({ width: 390, height: 844 });
			await waitForLoadedImages(page);
			await page.screenshot({
				path: path.join(SCREENSHOT_DIR, `${route.name}-mobile.png`),
				fullPage: true
			});
		}
	}

	expect(consoleErrors).toEqual([]);
	expect(pageErrors).toEqual([]);
	expect(serverErrors).toEqual([]);
});

test('redirects, 404 page, mobile drawer, and product search work cleanly', async ({ page }) => {
	const { consoleErrors, pageErrors, serverErrors } = await attachErrorCollectors(page);

	const resProduk = await page.goto('/produk');
	expect(resProduk?.status()).toBe(200);
	expect(page.url()).toContain('/products');

	const resCart = await page.goto('/cart');
	expect(resCart?.status()).toBe(200);
	expect(page.url()).toContain('/products');

	await page.goto('/products?q=pagar', { waitUntil: 'load' });
	const searchInput = page.locator('input[type="search"]').first();
	await expect(searchInput).toHaveValue('pagar');

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/', { waitUntil: 'load' });
	const menuBtn = page.getByRole('button', { name: /buka menu/i });
	await menuBtn.click();
	await expect(page.getByRole('button', { name: /tutup menu/i })).toBeVisible();
	if (process.env.CAPTURE_AFTER === '1') {
		fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
		await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'home-mobile-menu-open.png') });
	}
	await page.getByRole('button', { name: /tutup menu/i }).click();

	expect(consoleErrors).toEqual([]);

	await page.setViewportSize({ width: 1440, height: 900 });
	const res404 = await page.goto('/halaman-tidak-ada-404', { waitUntil: 'load' });
	expect(res404?.status()).toBe(404);
	await expect(page.locator('h1')).toContainText(/404|tidak ditemukan/i);
	if (process.env.CAPTURE_AFTER === '1') {
		await page.screenshot({
			path: path.join(SCREENSHOT_DIR, 'not-found-desktop.png'),
			fullPage: true
		});
		await page.setViewportSize({ width: 390, height: 844 });
		await page.screenshot({
			path: path.join(SCREENSHOT_DIR, 'not-found-mobile.png'),
			fullPage: true
		});
	}

	expect(pageErrors).toEqual([]);
	expect(serverErrors).toEqual([]);
});
