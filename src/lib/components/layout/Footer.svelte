<script lang="ts">
	import CurrentYear from '#lib/components/ui/CurrentYear.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { footerLinks, siteConfig } from '#lib/data/site.js';
	import { whatsappLink } from '#lib/whatsapp.js';

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-line bg-white">
	<div class="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
		<div>
			<p class="font-heading text-2xl font-extrabold tracking-wide uppercase">
				{siteConfig.name}
			</p>
			<p class="mt-2 text-muted">{siteConfig.tagline}</p>
		</div>

		<nav aria-label="Navigasi footer">
			<h2 class="font-heading text-base font-bold tracking-wide uppercase">Tentang Kami</h2>
			<ul class="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
				{#each footerLinks as link (link.href)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={link.href}
							class="inline-flex min-h-11 items-center text-muted transition-colors duration-200 hover:text-brand motion-reduce:transition-none"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div>
			<h2 class="font-heading text-base font-bold tracking-wide uppercase">Order Sekarang</h2>
			<p class="mt-3 text-muted">
				Pemesanan bisa melalui WhatsApp dengan konsultasi terkait produk yang akan dibuat.
			</p>
			<a
				href={whatsappLink(siteConfig.contact.whatsappOrder)}
				target="_blank"
				rel="noopener noreferrer"
				class="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-ink transition-colors duration-200 hover:text-brand motion-reduce:transition-none"
			>
				<Icon name="whatsapp" size={20} />
				Chat via WhatsApp
			</a>
		</div>
	</div>

	<div class="border-t border-line">
		<p class="container-page py-5 text-sm text-muted">
			&copy; <CurrentYear serverYear={year} />
			{siteConfig.name}. Hak cipta dilindungi.
		</p>
	</div>
</footer>
