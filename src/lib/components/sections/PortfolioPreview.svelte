<script lang="ts">
	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import type { PortfolioItem } from '#lib/types/api.js';

	import PortfolioRow from './PortfolioRow.svelte';

	interface Props {
		items: PortfolioItem[];
	}

	let { items }: Props = $props();
</script>

<section id="portfolio" class="py-16 lg:py-24">
	<div
		class="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-12"
	>
		<div class="container-page lg:order-last lg:px-0 lg:pr-14">
			<p class="text-sm font-bold tracking-wider text-brand uppercase">Portofolio kami</p>
			<h2 class="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
				Project Yang Pernah Kami Kerjakan
			</h2>
			<p class="mt-4 text-sm text-muted">
				Sangat ideal untuk bermitra dengan kami karena sudah tidak diragukan lagi cara kami dalam
				menangani orderan dari anda semua
			</p>
			<ButtonLink href="/portfolio" class="mt-6">Lihat Semua</ButtonLink>
		</div>

		{#if items.length > 0}
			<PortfolioRow {items} />
		{/if}
	</div>
</section>
