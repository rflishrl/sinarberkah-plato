<script lang="ts">
	import { cn } from '#lib/utils.js';

	interface Props {
		eyebrow?: string;
		title: string;
		description?: string;
		as?: 'h1' | 'h2';
		align?: 'left' | 'center';
		tone?: 'light' | 'dark';
		class?: string;
	}

	let {
		eyebrow,
		title,
		description,
		as: tag = 'h2',
		align = 'center',
		tone = 'light',
		class: className
	}: Props = $props();

	const isDark = $derived(tone === 'dark');
</script>

<div class={cn(align === 'center' && 'text-center', className)}>
	{#if eyebrow}
		<p
			class={cn(
				'mb-2 text-sm font-bold tracking-wider uppercase',
				isDark ? 'text-surface' : 'text-brand'
			)}
		>
			{eyebrow}
		</p>
	{/if}
	<svelte:element
		this={tag}
		class={cn(
			'font-heading text-2xl leading-tight font-bold text-balance',
			isDark ? 'text-white' : 'text-ink'
		)}
	>
		{title}
	</svelte:element>
	{#if description}
		<p
			class={cn(
				'mt-3 text-base text-pretty',
				align === 'center' && 'mx-auto max-w-2xl',
				isDark ? 'text-surface' : 'text-muted'
			)}
		>
			{description}
		</p>
	{/if}
</div>
