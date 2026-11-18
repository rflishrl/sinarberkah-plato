<script lang="ts">
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { siteConfig } from '#lib/data/site.js';
	import type { Product } from '#lib/types/api.js';
	import { formatRupiah } from '#lib/utils.js';
	import { whatsappLink } from '#lib/whatsapp.js';

	interface Props {
		products: Product[];
		query?: string;
		onQueryChange?: (value: string) => void;
	}

	let { products, query: controlledQuery, onQueryChange }: Props = $props();
	const inputId = $props.id();
	let internalQuery = $state('');

	const isControlled = $derived(controlledQuery !== undefined);
	const query = $derived(isControlled ? (controlledQuery ?? '') : internalQuery);

	const visible = $derived.by(() => {
		const term = query.trim().toLowerCase();
		if (!term) return products;
		return products.filter(
			(product) =>
				product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
		);
	});

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.value;
		if (!isControlled) {
			internalQuery = value;
		}
		onQueryChange?.(value);
	}
</script>

<div>
	<div class="mx-auto mb-10 max-w-sm">
		<label for={inputId} class="sr-only">Cari produk</label>
		<div class="relative">
			<Icon
				name="search"
				size={20}
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
			/>
			<input
				id={inputId}
				type="search"
				value={query}
				oninput={handleInput}
				placeholder="Cari produk"
				class="min-h-11 w-full rounded-xs border border-muted bg-white py-2 pr-3 pl-10 text-base"
			/>
		</div>
	</div>

	{#if visible.length === 0}
		<EmptyState message="Produk tidak ditemukan." />
	{:else}
		<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each visible as product (product._id)}
				<li
					class="group flex flex-col justify-between rounded-xs border border-line bg-white p-4 shadow-xs transition-shadow duration-200 hover:shadow-card"
				>
					<div>
						<div class="relative aspect-[4/3] w-full overflow-hidden rounded-xs bg-line">
							{#if product.image.image_url}
								<MediaImage
									fill
									src={product.image.image_url}
									thumbSrc={product.image.thumb_url}
									variant="thumb"
									alt={product.name}
									width={480}
									height={360}
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
									class="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
								/>
							{:else}
								<div class="flex size-full items-center justify-center text-sm text-muted">
									Tanpa foto
								</div>
							{/if}
						</div>
						{#if product.category}
							<p class="mt-3 text-xs font-semibold tracking-wider text-muted uppercase">
								{product.category}
							</p>
						{/if}
						<h2 class="mt-1 font-heading text-lg font-bold text-ink">
							{product.name}
						</h2>
						<p class="mt-1 text-base font-bold text-brand">
							{formatRupiah(product.price)}
						</p>
						{#if product.description}
							<p class="mt-1 line-clamp-2 text-sm text-muted">
								{product.description}
							</p>
						{/if}
					</div>
					<div class="mt-4 pt-2">
						<a
							href={whatsappLink(
								siteConfig.contact.whatsappOrder,
								`Halo, saya tertarik dengan produk ${product.name}.`
							)}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xs bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-[#20ba5a] motion-reduce:transition-none"
						>
							<Icon name="whatsapp" size={18} />
							<span>Tanya via WhatsApp</span>
						</a>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
