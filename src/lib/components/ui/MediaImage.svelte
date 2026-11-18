<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	import { type MediaVariant, resolveMediaUrl } from '#lib/media-url.js';
	import { cn } from '#lib/utils.js';

	interface Props extends Omit<
		HTMLImgAttributes,
		'src' | 'loading' | 'decoding' | 'fetchpriority' | 'class'
	> {
		src: string | null | undefined;
		thumbSrc?: string | null | undefined;
		variant?: MediaVariant;
		priority?: 'high' | 'low';
		fill?: boolean;
		fallback?: string;
		alt: string;
		class?: string;
	}

	let {
		src,
		thumbSrc,
		variant = 'full',
		priority,
		fill = false,
		fallback,
		alt,
		class: className,
		...rest
	}: Props = $props();

	const resolvedSrc = $derived(
		resolveMediaUrl(src, {
			thumbUrl: thumbSrc,
			variant,
			fallback
		})
	);

	function handleError(event: Event) {
		const img = event.currentTarget;
		if (fallback && img instanceof HTMLImageElement && img.dataset.fallbackApplied !== 'true') {
			img.dataset.fallbackApplied = 'true';
			img.src = fallback;
		}
	}
</script>

{#if resolvedSrc}
	<img
		src={resolvedSrc}
		{alt}
		loading={priority === 'high' ? 'eager' : 'lazy'}
		decoding="async"
		fetchpriority={priority}
		onerror={fallback ? handleError : undefined}
		class={cn(fill && 'absolute inset-0 size-full', className)}
		{...rest}
	/>
{/if}
