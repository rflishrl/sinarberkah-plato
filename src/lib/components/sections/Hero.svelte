<script lang="ts">
	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import type { HeroSlide } from '#lib/types/api.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		slides: HeroSlide[];
	}

	let { slides }: Props = $props();
	let index = $state(0);

	const total = $derived(slides.length);
	const slide = $derived(slides[index]);
	const number = $derived(String(index + 1).padStart(2, '0'));

	const arrowBase =
		'inline-flex size-14 cursor-pointer items-center justify-center text-white transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-white lg:size-[88px]';
	const ghostText =
		'pointer-events-none absolute hidden font-heading text-[clamp(5rem,10vw,8rem)] leading-[1.26] font-extrabold text-ghost select-none lg:block';

	function go(step: number) {
		if (total === 0) return;
		index = (index + step + total) % total;
	}
</script>

{#if slide}
	<section
		aria-roledescription="carousel"
		aria-label="Sorotan layanan"
		class="relative isolate -mt-16 overflow-x-clip bg-surface pt-16 lg:-mt-[86px] lg:pt-[86px]"
	>
		<div class="relative mx-auto w-full max-w-[1280px] pb-16 lg:h-[634px] lg:pb-0">
			<div
				aria-hidden="true"
				class="absolute top-0 left-[46.17%] -z-10 hidden h-[506px] w-[calc(53.83%+50vw)] bg-white lg:block"
			></div>

			<span
				aria-hidden="true"
				class={cn(
					ghostText,
					'bottom-[73px] left-[4.375%] -z-10 rotate-180 whitespace-nowrap uppercase [writing-mode:vertical-rl]'
				)}
			>
				Sinar Berkah
			</span>

			<span aria-hidden="true" class={cn(ghostText, 'top-[435px] left-[37.19%] -z-10')}>
				{number}
			</span>

			{#key slide.id}
				<div
					role="group"
					aria-roledescription="slide"
					aria-label={`${index + 1} dari ${total}`}
					aria-live="polite"
					class="relative z-10 animate-fade-in px-5 pt-12 sm:px-8 lg:absolute lg:top-[176px] lg:left-[22.11%] lg:w-[34.06%] lg:px-0 lg:pt-0"
				>
					<h1
						class="font-heading text-4xl leading-[1.25] font-extrabold text-balance text-ink sm:text-5xl lg:text-[clamp(2.25rem,3.75vw,3rem)]"
					>
						{slide.title}
					</h1>
					<p class="mt-[17px] text-base leading-[22px] font-medium text-pretty text-muted">
						{slide.description}
					</p>
					<ButtonLink href={slide.ctaHref} class="mt-8 lg:mt-12">
						{slide.ctaLabel}
					</ButtonLink>
				</div>
			{/key}

			<div
				class="relative mx-5 mt-12 mb-7 sm:mx-8 lg:absolute lg:top-[112px] lg:left-[50.78%] lg:m-0 lg:w-[44.84%]"
			>
				{#key slide.id}
					<div class="relative aspect-[574/385] w-full animate-fade-in overflow-hidden bg-line">
						<MediaImage
							fill
							src={slide.image.src}
							variant="full"
							alt={slide.image.alt}
							width={1148}
							height={770}
							sizes="(min-width: 1280px) 574px, (min-width: 1024px) 45vw, 100vw"
							priority={index === 0 ? 'high' : 'low'}
							class="object-cover grayscale"
						/>
					</div>
				{/key}

				<div
					class="absolute right-0 -bottom-7 flex gap-0.5 lg:top-[calc(100%-24px)] lg:bottom-auto"
				>
					<button
						type="button"
						onclick={() => go(-1)}
						aria-label="Slide sebelumnya"
						class={cn(arrowBase, 'bg-ink/35 hover:bg-ink/70')}
					>
						<Icon name="arrow-back" size={20} />
					</button>
					<button
						type="button"
						onclick={() => go(1)}
						aria-label="Slide berikutnya"
						class={cn(arrowBase, 'bg-ink hover:bg-black')}
					>
						<Icon name="arrow-forward" size={20} />
					</button>
				</div>
			</div>
		</div>
	</section>
{/if}
