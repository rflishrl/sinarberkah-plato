<script lang="ts">
	import EmptyState from '#lib/components/ui/EmptyState.svelte';
	import HeadTags from '#lib/components/ui/HeadTags.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import { buildHeadMeta } from '#lib/metadata.js';
	import { formatDate } from '#lib/utils.js';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const headMeta = buildHeadMeta({
		title: 'Artikel',
		description: 'Artikel dan informasi seputar ornamen, plat dan konstruksi.',
		path: '/article',
		noIndex: true
	});
</script>

<HeadTags meta={headMeta} />
<PageHeader title="Artikel" />
<section class="container-page py-12 lg:py-16">
	{#if data.articles.length === 0}
		<EmptyState message="Belum ada artikel." />
	{:else}
		<ul class="divide-y divide-line">
			{#each data.articles as article (article._id)}
				<li class="flex flex-col gap-6 py-8 first:pt-0 md:flex-row">
					<div class="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-line md:w-64">
						<MediaImage
							fill
							src={article.image.image_url}
							thumbSrc={article.image.thumb_url}
							variant="thumb"
							alt={article.title}
							width={480}
							height={360}
							sizes="(min-width: 768px) 256px, 100vw"
							class="object-cover"
						/>
					</div>
					<article class="flex-1">
						<p class="text-sm font-bold tracking-wider text-brand uppercase">
							{article.category}
						</p>
						<h2 class="mt-1 font-heading text-2xl font-bold">
							{article.title}
						</h2>
						<p class="mt-2 line-clamp-4 text-muted">
							{article.content}
						</p>
						<time dateTime={article.createdAt} class="mt-4 block text-sm text-muted">
							{formatDate(article.createdAt)}
						</time>
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</section>
