<script lang="ts">
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import HeadTags from '#lib/components/ui/HeadTags.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import { buildHeadMeta } from '#lib/metadata.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const headMeta = buildHeadMeta({
		title: 'Portofolio',
		description: 'Proyek ornamen, railing, pagar dan sketsel yang pernah dikerjakan Sinar Berkah.',
		path: '/portfolio'
	});
</script>

<HeadTags meta={headMeta} />
<PageHeader
	title="Portofolio Sinar Berkah"
	description="Setiap proyek adalah kesempatan untuk menghasilkan ornamen yang unik dan bernilai. Berikut sebagian proyek yang pernah kami kerjakan."
/>
<section class="container-page py-12 lg:py-16">
	{#if data.items.length === 0}
		<EmptyState message="Portofolio belum tersedia." />
	{:else}
		<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each data.items as item (item._id)}
				<li class="flex flex-col bg-surface p-5">
					<div class="relative aspect-[4/3] w-full overflow-hidden bg-line">
						<MediaImage
							fill
							src={item.image.image_url}
							thumbSrc={item.image.thumb_url}
							variant="thumb"
							alt={item.title}
							width={480}
							height={360}
							sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
							class="object-cover"
						/>
					</div>
					<p class="mt-4 text-xs font-bold tracking-wider text-brand uppercase">
						{item.type}
					</p>
					<h2 class="mt-1 font-heading text-lg font-bold">
						{item.title}
					</h2>
					<p class="mt-2 text-sm text-muted">{item.description}</p>
				</li>
			{/each}
		</ul>
	{/if}
</section>
