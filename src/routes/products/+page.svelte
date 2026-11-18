<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	import ProductGrid from '#lib/components/sections/ProductGrid.svelte';
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import HeadTags from '#lib/components/ui/HeadTags.svelte';
	import JsonLd from '#lib/components/ui/JsonLd.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import { resolveMediaUrl } from '#lib/media-url.js';
	import { absoluteUrl, buildHeadMeta } from '#lib/metadata.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const query = $derived(page.url.searchParams.get('q') ?? data.initialQuery ?? '');

	const headMeta = buildHeadMeta({
		title: 'Produk',
		description: 'Daftar produk dan harga dari Sinar Berkah.',
		path: '/products'
	});

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		itemListElement: data.products.map((product, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'Product',
				name: product.name,
				description: product.description || undefined,
				image: (() => {
					const safeImage = resolveMediaUrl(product.image.image_url, { variant: 'full' });
					return safeImage ? absoluteUrl(safeImage) : undefined;
				})(),
				offers: {
					'@type': 'Offer',
					price: product.price,
					priceCurrency: 'IDR'
				}
			}
		}))
	});

	function handleQueryChange(newQuery: string) {
		const nextUrl = new URL(page.url.href);
		if (newQuery) {
			nextUrl.searchParams.set('q', newQuery);
		} else {
			nextUrl.searchParams.delete('q');
		}
		const resolvedBase = resolve('/products');
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void goto(`${resolvedBase}${nextUrl.search}`, {
			replace: true,
			shallow: true,
			reset: false
		});
	}
</script>

<HeadTags meta={headMeta} />
<JsonLd data={jsonLd} />
<PageHeader title="Produk Sinar Berkah" />
<section class="container-page py-12 lg:py-16">
	{#if data.products.length === 0}
		<EmptyState message="Belum ada produk." />
	{:else}
		<ProductGrid products={data.products} {query} onQueryChange={handleQueryChange} />
	{/if}
</section>
