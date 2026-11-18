<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import MediaImage from '#lib/components/ui/MediaImage.svelte';
	import { siteConfig } from '#lib/data/site.js';

	const watchVideoStyles =
		'group inline-flex items-center gap-4 font-heading text-base font-semibold text-brand lowercase';
	const playIconStyles =
		'inline-flex h-[43px] w-[42px] items-center justify-center bg-brand text-white transition-colors duration-200 motion-reduce:transition-none';
</script>

<section id="about" class="py-16 lg:pt-[200px] lg:pb-24">
	<div
		class="container-page grid items-start gap-10 md:grid-cols-2 lg:mx-auto lg:max-w-[808px] lg:grid-cols-[372px_372px] lg:justify-between lg:gap-0 lg:px-0"
	>
		<div class="relative mx-auto aspect-[372/410] w-full max-w-[372px]">
			<div class="absolute top-0 left-0 h-[76.1%] w-[67.2%] shadow-photo">
				<MediaImage
					fill
					src="/images/about-grinding.png"
					variant="full"
					alt="Pekerja menggerinda rangka besi hingga memercikkan api"
					width={464}
					height={580}
					sizes="(min-width: 1024px) 250px, 60vw"
					class="object-cover"
				/>
			</div>
			<div class="absolute right-0 bottom-0 h-[79%] w-[67.2%] shadow-photo">
				<MediaImage
					fill
					src="/images/about-welding.webp"
					variant="full"
					alt="Pekerja mengelas pipa besi di dalam bengkel"
					width={1074}
					height={806}
					sizes="(min-width: 1024px) 250px, 60vw"
					class="object-cover object-[25%_50%]"
				/>
			</div>
		</div>

		<div class="lg:pt-[86px]">
			<p class="text-sm leading-[19px] font-bold tracking-normal text-brand uppercase">
				Tentang Kami
			</p>
			<h2 class="mt-3.5 font-heading text-2xl leading-[30px] font-bold text-ink">
				Kami Sudah Sangat Berpengalaman
			</h2>
			<p class="mt-3 text-lg leading-[25px] font-medium text-muted">
				Sudah terjun ke bidang industri, fabrikasi, dan konstruksi lebih dari 5 tahun
			</p>
			<p class="mt-8 text-sm leading-[19px] font-medium text-muted">
				Tidak ada keraguan lagi untuk bermitra dengan kami karena memang pengalaman kami yang sudah
				sangat ahli di bidangnya
			</p>

			<div class="mt-9">
				{#if siteConfig.aboutVideoUrl}
					<a
						href={siteConfig.aboutVideoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class={watchVideoStyles}
					>
						<span class={`${playIconStyles} group-hover:bg-brand-hover`}>
							<Icon name="play" size={28} />
						</span>
						Tonton Video Profil
					</a>
				{:else}
					<div class="inline-flex items-center gap-3 text-sm font-medium text-muted">
						<span class="flex size-11 items-center justify-center rounded-full bg-line text-muted">
							<Icon name="play" size={24} />
						</span>
						<span>Video profil sedang dipersiapkan</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
