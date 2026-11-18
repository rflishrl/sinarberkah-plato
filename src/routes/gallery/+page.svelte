<script lang="ts">
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import HeadTags from '#lib/components/ui/HeadTags.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import { buildHeadMeta } from '#lib/metadata.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const headMeta = buildHeadMeta({
		title: 'Galeri Pola',
		description:
			'Koleksi pola ornamen Sinar Berkah. Tersedia pola jadi maupun pola custom sesuai kebutuhan Anda.',
		path: '/gallery',
		image: {
			url: '/images/pattern-gallery.png',
			width: 1116,
			height: 446,
			alt: 'Lima contoh pola ornamen Sinar Berkah'
		}
	});
</script>

<HeadTags meta={headMeta} />
<PageHeader
	title="Galeri Pola Sinar Berkah"
	description="Pilih pola yang sudah jadi atau kirimkan pola Anda sendiri. Kami akan membuatnya sesuai kebutuhan."
/>
<section class="container-page py-12 lg:py-16">
	{#if data.items.length === 0}
		<EmptyState message="Galeri pola belum tersedia." />
	{:else}
		<ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.items as item (item._id)}
				<li>
					<figure>
						<div class="relative aspect-[3/4] w-full overflow-hidden border border-line bg-white">
							<MediaImage
								fill
								src={item.image.image_url}
								thumbSrc={item.image.thumb_url}
								variant="thumb"
								alt={item.title}
								width={480}
								height={640}
								sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
								class="object-contain"
							/>
						</div>
						<figcaption class="mt-3">
							<p class="text-xs font-bold tracking-wider text-brand uppercase">
								{item.type}
							</p>
							<h2 class="font-heading text-lg font-bold">
								{item.title}
							</h2>
							<p class="mt-1 text-sm text-muted">
								{item.description}
							</p>
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	{/if}
</section>
