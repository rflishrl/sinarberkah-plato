<script lang="ts">
	import { page } from '$app/state';
	import { refreshAll } from '$app/navigation';

	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import { buttonStyles } from '#lib/components/ui/button-styles.js';
</script>

{#if page.status === 404}
	<section
		class="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center"
	>
		<p class="font-heading text-7xl font-extrabold text-ghost">404</p>
		<h1 class="mt-2 font-heading text-2xl font-bold">Halaman tidak ditemukan</h1>
		<p class="mt-2 max-w-md text-muted">Halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
		<ButtonLink href="/" class="mt-6">Kembali ke Beranda</ButtonLink>
	</section>
{:else}
	<section
		class="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center"
	>
		<h1 class="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
		<p class="mt-2 max-w-md text-muted">Halaman tidak dapat dimuat saat ini. Silakan coba lagi.</p>
		{#if page.error?.message}
			<p class="mt-2 text-sm text-muted">Pesan: {page.error.message}</p>
		{/if}
		<button type="button" onclick={() => refreshAll()} class={buttonStyles('primary', 'mt-6')}>
			Coba Lagi
		</button>
	</section>
{/if}
