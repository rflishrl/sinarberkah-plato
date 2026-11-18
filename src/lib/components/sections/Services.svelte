<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { services } from '#lib/data/content.js';
</script>

<section id="services" class="py-16 lg:py-24">
	<div class="container-page">
		<SectionHeading eyebrow="Layanan yang tersedia" title="Kami Memberikan Pelayanan Terbaik" />

		<ul class="mx-auto mt-12 grid max-w-[715px] gap-8 sm:grid-cols-3 sm:gap-0">
			{#each services as service (service.id)}
				<li class="py-1.5 sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-2.5">
					<Icon name={service.icon} size={46} class="text-ink" />
					<h3 class="mt-2 font-heading text-base leading-5 font-bold">
						{service.title}
					</h3>
					<p class="mt-1 text-sm leading-[18px] font-medium text-muted">
						{service.description}
					</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
