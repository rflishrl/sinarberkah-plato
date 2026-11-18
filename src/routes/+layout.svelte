<script lang="ts">
	import '../styles/globals.css';

	import Footer from '#lib/components/layout/Footer.svelte';
	import Navbar from '#lib/components/layout/Navbar.svelte';
	import { siteConfig } from '#lib/data/site.js';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="application-name" content={siteConfig.name} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xs focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
>
	Lewati ke konten utama
</a>
<Navbar />
<main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
	{@render children()}
</main>
<Footer />
