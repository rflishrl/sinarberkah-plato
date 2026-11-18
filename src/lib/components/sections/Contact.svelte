<script lang="ts">
	import Icon from '#lib/components/ui/Icon.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import { siteConfig } from '#lib/data/site.js';
	import { whatsappLink } from '#lib/whatsapp.js';

	const { contact, socialLinks } = siteConfig;
</script>

<section id="contact" class="bg-surface py-16 lg:py-24">
	<div class="container-page">
		<SectionHeading eyebrow="Informasi" title="Temukan Bengkel Di Mana Saja dan Kapan Saja" />

		<div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
			<iframe
				title="Lokasi Bengkel Sinar Berkah di Google Maps"
				src={siteConfig.mapEmbedUrl}
				width={600}
				height={450}
				loading="lazy"
				allowfullscreen
				referrerpolicy="no-referrer-when-downgrade"
				class="aspect-[4/3] w-full border-0 bg-line sm:aspect-[16/10] lg:aspect-auto lg:min-h-[420px]"
			></iframe>

			<div class="flex flex-col gap-8 bg-white p-6 shadow-card sm:p-8">
				<div>
					<h3 class="font-heading text-base font-bold tracking-wide text-brand uppercase">
						Contact Us
					</h3>
					<ul class="mt-4 space-y-4 text-sm">
						<li class="flex gap-3">
							<Icon name="location" size={20} class="mt-0.5 shrink-0" />
							<address class="not-italic">{contact.address}</address>
						</li>
						<li>
							<a href={contact.phoneHref} class="flex min-h-11 items-center gap-3 hover:text-brand">
								<Icon name="phone" size={20} class="shrink-0" />
								{contact.phoneDisplay}
							</a>
						</li>
						{#if contact.email}
							<li>
								<a
									href={`mailto:${contact.email}`}
									class="flex min-h-11 items-center gap-3 hover:text-brand"
								>
									<Icon name="email" size={20} class="shrink-0" />
									{contact.email}
								</a>
							</li>
						{/if}
					</ul>
				</div>

				<div>
					<h3 class="font-heading text-base font-bold tracking-wide text-brand uppercase">
						Sosial Media
					</h3>
					<ul class="mt-2 text-sm">
						<li>
							<a
								href={whatsappLink(contact.whatsappGeneral)}
								target="_blank"
								rel="noopener noreferrer"
								class="flex min-h-11 items-center gap-3 hover:text-brand"
							>
								<Icon name="whatsapp" size={20} class="shrink-0" />
								WhatsApp
							</a>
						</li>
						{#each socialLinks as link (link.label)}
							<li>
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									class="flex min-h-11 items-center gap-3 hover:text-brand"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
