<script lang="ts">
	import { siteConfig } from '#lib/data/site.js';
	import type { HeadMeta } from '#lib/metadata.js';

	interface Props {
		meta: HeadMeta;
	}

	let { meta }: Props = $props();
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	{#if meta.noIndex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	<link rel="canonical" href={meta.canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content={siteConfig.locale} />
	<meta property="og:site_name" content={siteConfig.name} />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:url" content={meta.canonicalUrl} />
	<meta property="og:image" content={meta.imageUrl} />
	<meta property="og:image:width" content={meta.imageWidth} />
	<meta property="og:image:height" content={meta.imageHeight} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={meta.title} />
	<meta name="twitter:description" content={meta.description} />
	<meta name="twitter:image" content={meta.imageUrl} />
</svelte:head>
