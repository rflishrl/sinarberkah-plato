<script lang="ts">
	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import { materials } from '#lib/data/content.js';
	import { siteConfig } from '#lib/data/site.js';
	import { whatsappLink } from '#lib/whatsapp.js';
</script>

<section id="materials" class="py-16 lg:py-24">
	<div class="container-page grid items-center gap-10 md:grid-cols-2 lg:gap-14">
		<ul class="mx-auto grid w-full max-w-[420px] grid-cols-2 gap-4 sm:gap-5 lg:mx-0">
			{#each materials as material (material.name)}
				<li
					class="flex flex-col justify-between rounded-xs bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-photo sm:p-6"
				>
					<div>
						<h3 class="text-center font-heading text-base leading-5 font-bold text-ink">
							{material.name}
						</h3>
						<ul class="mt-3 flex flex-col gap-2 text-sm leading-[19px] font-medium text-muted">
							<li>{material.thickness}</li>
							{#each material.notes as note (note)}
								<li>{note}</li>
							{/each}
						</ul>
					</div>
				</li>
			{/each}
		</ul>

		<div>
			<p class="text-sm font-bold tracking-wider text-brand uppercase">Bahan Bahan</p>
			<h2 class="mt-2 font-heading text-2xl leading-tight font-bold text-balance lg:text-3xl">
				Kami Memiliki Bahan Sesuai Kebutuhan
			</h2>
			<p class="mt-4 text-base text-muted lg:text-lg">
				Pilihlah sesuai kebutuhan dan kondisi ornamen anda
			</p>
			<p class="mt-3 text-sm text-muted">
				Setiap bahan memiliki kegunaan kekurangan serta kelebihan masing-masing maka dapat
				disesuaikan dengan kondisi yang ada
			</p>
			<ButtonLink
				href={whatsappLink(
					siteConfig.contact.whatsappGeneral,
					'Halo, saya ingin konsultasi soal bahan.'
				)}
				class="mt-6"
			>
				Konsultasi Sekarang
			</ButtonLink>
		</div>
	</div>
</section>
