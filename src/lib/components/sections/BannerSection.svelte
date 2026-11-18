<script lang="ts">
	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { cn } from '#lib/utils.js';

	interface Props {
		eyebrow: string;
		title: string;
		ctaLabel: string;
		ctaHref: string;
		image: string;
		tone?: 'light' | 'dark';
	}

	let { eyebrow, title, ctaLabel, ctaHref, image, tone = 'light' }: Props = $props();
	const isDark = $derived(tone === 'dark');
</script>

<section class={cn('relative isolate overflow-hidden', isDark ? 'bg-ink on-dark' : 'bg-surface')}>
	<div aria-hidden="true" class="absolute inset-x-0 bottom-0 -z-10 h-40 sm:h-full">
		<MediaImage
			fill
			src={image}
			variant="full"
			alt=""
			sizes="100vw"
			class="object-cover object-right-bottom"
		/>
	</div>

	<div class="container-page pt-14 pb-48 sm:py-20 lg:py-[4.5rem]">
		<p
			class={cn(
				'text-sm font-bold tracking-wider uppercase',
				isDark ? 'text-surface' : 'text-brand'
			)}
		>
			{eyebrow}
		</p>
		<h2
			class={cn(
				'mt-3 max-w-xl font-heading text-3xl leading-tight font-bold text-balance sm:text-4xl lg:text-5xl',
				isDark ? 'text-white' : 'text-ink'
			)}
		>
			{title}
		</h2>
		<ButtonLink href={ctaHref} class="mt-8">
			{ctaLabel}
		</ButtonLink>
	</div>
</section>
