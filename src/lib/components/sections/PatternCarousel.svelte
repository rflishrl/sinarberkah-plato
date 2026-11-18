<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { PatternSlide } from '#lib/types/api.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		slides: PatternSlide[];
	}

	const AUTOPLAY_INTERVAL_MS = 4000;

	let { slides }: Props = $props();
	let trackEl = $state<HTMLDivElement | null>(null);
	let index = $state(0);
	let interacting = $state(false);
	let isDesktop = $state(false);
	let prefersReducedMotion = $state(false);

	const total = $derived(slides.length);
	const canAutoplay = $derived(isDesktop && !prefersReducedMotion && total > 1);
	const isPlaying = $derived(canAutoplay && !interacting);

	$effect(() => {
		const mqDesktop = window.matchMedia('(min-width: 1024px) and (hover: hover)');
		const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			isDesktop = mqDesktop.matches;
			prefersReducedMotion = mqMotion.matches;
		};
		sync();
		mqDesktop.addEventListener('change', sync);
		mqMotion.addEventListener('change', sync);
		return () => {
			mqDesktop.removeEventListener('change', sync);
			mqMotion.removeEventListener('change', sync);
		};
	});

	$effect(() => {
		if (!isPlaying) return;
		const timer = window.setInterval(() => {
			if (!trackEl || trackEl.clientWidth === 0 || document.hidden) return;
			const current = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
			trackEl.scrollTo({
				left: ((current + 1) % total) * trackEl.clientWidth,
				behavior: 'smooth'
			});
		}, AUTOPLAY_INTERVAL_MS);
		return () => window.clearInterval(timer);
	});

	function scrollToSlide(target: number) {
		if (!trackEl) return;
		trackEl.scrollTo({
			left: target * trackEl.clientWidth,
			behavior: prefersReducedMotion ? 'auto' : 'smooth'
		});
	}

	function handleScroll() {
		if (!trackEl || trackEl.clientWidth === 0) return;
		index = Math.round(trackEl.scrollLeft / trackEl.clientWidth);
	}
</script>

<div
	role="region"
	aria-roledescription="carousel"
	aria-label="Galeri pola"
	class="mt-10 w-full"
	onmouseenter={() => (interacting = true)}
	onmouseleave={() => (interacting = false)}
>
	<div class="relative mx-auto max-w-[695px]">
		{#if total > 1}
			<button
				type="button"
				onclick={() => scrollToSlide((index - 1 + total) % total)}
				aria-label="Slide pola sebelumnya"
				class="absolute top-1/2 -left-12 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand hover:shadow-card lg:flex"
			>
				<Icon name="chevron-left" size={24} />
			</button>
			<button
				type="button"
				onclick={() => scrollToSlide((index + 1) % total)}
				aria-label="Slide pola berikutnya"
				class="absolute top-1/2 -right-12 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand hover:shadow-card lg:flex"
			>
				<Icon name="chevron-right" size={24} />
			</button>
		{/if}

		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			bind:this={trackEl}
			onscroll={handleScroll}
			onfocus={() => (interacting = true)}
			onblur={() => (interacting = false)}
			tabindex={0}
			aria-live={isPlaying ? 'off' : 'polite'}
			class="flex w-full snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
		>
			{#each slides as slide, i (slide.id)}
				<div
					role="group"
					aria-roledescription="slide"
					aria-label={`${i + 1} dari ${total}`}
					class="w-full shrink-0 snap-center"
				>
					{#if slide.kind === 'strip'}
						<MediaImage
							src={slide.src}
							variant="full"
							priority={i === 0 ? undefined : 'low'}
							alt={slide.alt}
							width={1116}
							height={446}
							sizes="(min-width: 768px) 695px, 100vw"
							class="h-auto w-full"
						/>
					{:else}
						<div class="relative mx-auto h-[220px] w-full bg-white sm:h-[360px] lg:h-[440px]">
							<MediaImage
								fill
								src={slide.src}
								thumbSrc={slide.thumbSrc}
								variant="thumb"
								priority={i === 0 ? undefined : 'low'}
								alt={slide.alt}
								width={480}
								height={480}
								sizes="(min-width: 768px) 695px, 100vw"
								class="object-contain"
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<div
		class="relative mx-auto mt-3 flex w-full max-w-[695px] flex-wrap items-center justify-center"
	>
		{#each slides as slide, i (slide.id)}
			<button
				type="button"
				onclick={() => scrollToSlide(i)}
				aria-label={`Tampilkan slide ${i + 1}`}
				aria-current={i === index}
				class="group inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center p-2"
			>
				<span
					class={cn(
						'size-[9px] rounded-full transition-colors duration-200 motion-reduce:transition-none',
						i === index ? 'bg-brand' : 'bg-line group-hover:bg-muted/50'
					)}
				></span>
			</button>
		{/each}
	</div>
</div>
