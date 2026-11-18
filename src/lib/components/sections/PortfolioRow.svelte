<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { PortfolioItem } from '#lib/types/api.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		items: PortfolioItem[];
	}

	const CLONE_COPIES = 3;

	let { items }: Props = $props();
	let viewportEl = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(0);
	let canScroll = $state(true);

	const marqueeItems = $derived([
		...items.map((item) => ({ item, isClone: false, key: item._id })),
		...Array.from({ length: CLONE_COPIES }, (_, copy) =>
			items.map((item) => ({
				item,
				isClone: true,
				key: `${item._id}-clone-${copy}`
			}))
		).flat()
	]);

	function getCards(viewport: HTMLElement): HTMLElement[] {
		return Array.from(viewport.querySelectorAll<HTMLElement>('figure:not([data-clone])'));
	}

	function handleScroll() {
		if (!viewportEl) return;
		canScroll = viewportEl.scrollWidth > viewportEl.clientWidth + 2;

		const cards = getCards(viewportEl);
		if (cards.length === 0) return;

		const atEnd = viewportEl.scrollLeft + viewportEl.clientWidth >= viewportEl.scrollWidth - 2;
		if (atEnd) {
			activeIndex = cards.length - 1;
			return;
		}

		const viewportLeft = viewportEl.getBoundingClientRect().left;
		const inset = parseFloat(getComputedStyle(viewportEl).scrollPaddingLeft) || 0;
		let closest = 0;
		let smallestGap = Infinity;
		cards.forEach((card, i) => {
			const gap = Math.abs(card.getBoundingClientRect().left - viewportLeft - inset);
			if (gap < smallestGap) {
				smallestGap = gap;
				closest = i;
			}
		});
		activeIndex = closest;
	}

	$effect(() => {
		if (!viewportEl) return;
		const observer = new ResizeObserver(handleScroll);
		observer.observe(viewportEl);
		return () => observer.disconnect();
	});

	function scrollToCard(index: number) {
		const card = viewportEl ? getCards(viewportEl)[index] : undefined;
		if (!viewportEl || !card) return;

		const inset = parseFloat(getComputedStyle(viewportEl).scrollPaddingLeft) || 0;
		const delta =
			card.getBoundingClientRect().left - viewportEl.getBoundingClientRect().left - inset;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		viewportEl.scrollBy({
			left: delta,
			behavior: reduceMotion ? 'auto' : 'smooth'
		});
	}
</script>

<div class="min-w-0">
	<div
		bind:this={viewportEl}
		onscroll={handleScroll}
		role="region"
		aria-label="Contoh proyek yang pernah dikerjakan"
		class="marquee-viewport snap-x snap-mandatory scroll-pl-5 [scrollbar-width:none] overflow-x-auto px-5 pb-4 sm:scroll-pl-8 sm:px-8 lg:pr-0 lg:pl-6 [&::-webkit-scrollbar]:hidden"
	>
		<div
			class="marquee-track flex w-max"
			style:--marquee-duration={`${Math.max(items.length, 1) * 12}s`}
		>
			{#each marqueeItems as entry (entry.key)}
				<figure
					data-clone={entry.isClone ? '' : undefined}
					aria-hidden={entry.isClone ? true : undefined}
					class="relative mr-4 aspect-[235/250] w-[70vw] max-w-60 shrink-0 snap-start bg-line sm:w-60"
				>
					<MediaImage
						fill
						src={entry.item.image.image_url}
						thumbSrc={entry.item.image.thumb_url}
						variant="thumb"
						alt={entry.isClone ? '' : entry.item.title}
						width={480}
						height={510}
						sizes="(min-width: 640px) 240px, 70vw"
						class="object-cover"
					/>
				</figure>
			{/each}
		</div>
	</div>

	{#if items.length > 1 && canScroll}
		<div class="marquee-dots mt-3 flex items-center justify-center gap-3">
			<button
				type="button"
				onclick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
				disabled={activeIndex === 0}
				aria-label="Proyek sebelumnya"
				class="hidden size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex"
			>
				<Icon name="chevron-left" size={20} />
			</button>

			<div class="flex flex-wrap items-center justify-center">
				{#each items as item, i (item._id)}
					<button
						type="button"
						onclick={() => scrollToCard(i)}
						aria-label={`Tampilkan proyek ${i + 1}`}
						aria-current={i === activeIndex}
						class="group inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center p-2"
					>
						<span
							class={cn(
								'size-2.5 rounded-full transition-colors duration-200 motion-reduce:transition-none',
								i === activeIndex ? 'bg-brand' : 'bg-line group-hover:bg-muted/50'
							)}
						></span>
					</button>
				{/each}
			</div>

			<button
				type="button"
				onclick={() => scrollToCard(Math.min(activeIndex + 1, items.length - 1))}
				disabled={activeIndex === items.length - 1}
				aria-label="Proyek berikutnya"
				class="hidden size-8 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-ink shadow-xs transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex"
			>
				<Icon name="chevron-right" size={20} />
			</button>
		</div>
	{/if}
</div>
