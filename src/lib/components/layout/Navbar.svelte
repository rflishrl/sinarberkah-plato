<script lang="ts">
	import { page } from '$app/state';

	import ButtonLink from '#lib/components/ui/ButtonLink.svelte';
	import Icon from '#lib/components/ui/Icon.svelte';
	import { navLinks, siteConfig } from '#lib/data/site.js';
	import { cn } from '#lib/utils.js';
	import { whatsappLink } from '#lib/whatsapp.js';

	const menuId = $props.id();
	const pathname = $derived(page.url.pathname);

	let openPath = $state<string | null>(null);
	let scrollY = $state(0);

	const isOpen = $derived(openPath === pathname);
	const scrolled = $derived(scrollY > 8);
	const isTransparent = $derived(pathname === '/' && !scrolled && !isOpen);
	const contactHref = whatsappLink(siteConfig.contact.whatsappGeneral);

	function handleKeydown(event: KeyboardEvent) {
		if (isOpen && event.key === 'Escape') {
			openPath = null;
		}
	}
</script>

<svelte:window bind:scrollY onkeydown={handleKeydown} />

<header
	class={cn(
		'sticky top-0 z-50 border-b transition-colors duration-200 motion-reduce:transition-none',
		isTransparent
			? 'border-transparent bg-transparent'
			: 'border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80'
	)}
>
	<div class="container-page flex h-16 items-center gap-6 lg:h-[86px] lg:gap-0">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href="/" class="font-sans text-xl font-extrabold text-ink uppercase sm:text-2xl">
			{siteConfig.name}
		</a>

		<nav aria-label="Navigasi utama" class="hidden lg:ml-[52px] lg:block">
			<ul class="flex items-center gap-8">
				{#each navLinks as link (link.href)}
					{@const active = pathname === link.href}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={link.href}
							aria-current={active ? 'page' : undefined}
							class={cn(
								'text-base font-medium transition-colors duration-200 motion-reduce:transition-none',
								active ? 'text-brand' : 'text-muted hover:text-brand'
							)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="ml-auto hidden lg:block">
			<ButtonLink href={contactHref}>Hubungi kami</ButtonLink>
		</div>

		<button
			type="button"
			class="-mr-2 ml-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-xs text-ink lg:hidden"
			aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
			aria-expanded={isOpen}
			aria-controls={menuId}
			onclick={() => {
				openPath = isOpen ? null : pathname;
			}}
		>
			<Icon name={isOpen ? 'close' : 'menu'} size={26} />
		</button>
	</div>

	<div id={menuId} hidden={!isOpen} class="border-t border-line bg-surface lg:hidden">
		<nav aria-label="Navigasi seluler" class="container-page py-3">
			<ul class="flex flex-col">
				{#each navLinks as link (link.href)}
					{@const active = pathname === link.href}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a
							href={link.href}
							aria-current={active ? 'page' : undefined}
							class={cn(
								'flex min-h-12 items-center text-base font-medium transition-colors duration-200 motion-reduce:transition-none',
								active ? 'text-brand' : 'text-muted hover:text-brand'
							)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<ButtonLink href={contactHref} class="mt-3 w-full">Hubungi Kami</ButtonLink>
		</nav>
	</div>
</header>
