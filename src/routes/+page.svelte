<script lang="ts">
	import About from '#lib/components/sections/About.svelte';
	import BannerSection from '#lib/components/sections/BannerSection.svelte';
	import Contact from '#lib/components/sections/Contact.svelte';
	import Hero from '#lib/components/sections/Hero.svelte';
	import Materials from '#lib/components/sections/Materials.svelte';
	import PatternCarousel from '#lib/components/sections/PatternCarousel.svelte';
	import PatternGallerySkeleton from '#lib/components/sections/PatternGallerySkeleton.svelte';
	import PortfolioPreview from '#lib/components/sections/PortfolioPreview.svelte';
	import PortfolioPreviewSkeleton from '#lib/components/sections/PortfolioPreviewSkeleton.svelte';
	import Services from '#lib/components/sections/Services.svelte';
	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import HeadTags from '#lib/components/ui/HeadTags.svelte';
	import JsonLd from '#lib/components/ui/JsonLd.svelte';
	import { heroSlides } from '#lib/data/content.js';
	import { siteConfig } from '#lib/data/site.js';
	import { absoluteUrl, buildHeadMeta } from '#lib/metadata.js';
	import { buildPatternSlides } from '#lib/patterns.js';
	import { whatsappLink } from '#lib/whatsapp.js';

	import type { PageData } from './$types';

	const PREVIEW_COUNT = 6;
	const PATTERN_PREVIEW_COUNT = 12;

	let { data }: { data: PageData } = $props();

	const headMeta = buildHeadMeta({
		title: '',
		description: siteConfig.description,
		path: '/'
	});

	const orderHref = whatsappLink(siteConfig.contact.whatsappOrder);

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: siteConfig.name,
		description: siteConfig.description,
		url: siteConfig.url,
		telephone: siteConfig.contact.phoneDisplay,
		image: absoluteUrl('/images/hero-1.png'),
		geo: {
			'@type': 'GeoCoordinates',
			latitude: siteConfig.location.latitude,
			longitude: siteConfig.location.longitude
		},
		address: {
			'@type': 'PostalAddress',
			streetAddress: siteConfig.location.streetAddress,
			addressLocality: siteConfig.location.locality,
			addressRegion: siteConfig.location.region,
			postalCode: siteConfig.location.postalCode,
			addressCountry: 'ID'
		}
	};
</script>

<HeadTags meta={headMeta} />
<JsonLd data={jsonLd} />
<Hero slides={heroSlides} />
<About />
<Services />
<BannerSection
	eyebrow="Fasilitas kami"
	title="Pengiriman Seluruh Indonesia"
	ctaLabel="Pesan Sekarang"
	ctaHref={orderHref}
	image="/images/delivery-bg.png"
/>

{#await data.portfolioPromise}
	<PortfolioPreviewSkeleton />
{:then portfolio}
	<PortfolioPreview items={portfolio.slice(0, PREVIEW_COUNT)} />
{/await}

{#await data.galleryPromise}
	<PatternGallerySkeleton />
{:then gallery}
	{@const slides = buildPatternSlides(gallery.slice(0, PATTERN_PREVIEW_COUNT))}
	<section id="patterns" class="py-16 lg:py-24">
		<div class="container-page flex flex-col items-center text-center">
			<p class="text-sm font-bold text-brand">Galeri Pola</p>
			<h2 class="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
				Pola Pola Yang Kami Miliki
			</h2>
			<p class="mt-2 max-w-xl font-heading font-medium text-muted">
				kami memiliki banyak pola yang sudah jadi atau bisa juga custom
			</p>
			<ButtonLink href="/gallery" class="mt-6">Lihat Semua</ButtonLink>
			<PatternCarousel {slides} />
		</div>
	</section>
{/await}

<BannerSection
	tone="dark"
	eyebrow="Promo"
	title="Dapatkan Penawaran Khusus"
	ctaLabel="Pesan Sekarang"
	ctaHref={orderHref}
	image="/images/promo-bg.png"
/>
<Materials />
<Contact />
