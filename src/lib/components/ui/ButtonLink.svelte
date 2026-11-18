<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	import { buttonStyles, type ButtonVariant } from './button-styles.js';

	interface Props extends Omit<HTMLAnchorAttributes, 'href' | 'class'> {
		href: string;
		variant?: ButtonVariant;
		class?: string;
		children: Snippet;
	}

	let { href, variant = 'primary', class: className, children, ...rest }: Props = $props();

	const styles = $derived(buttonStyles(variant, className));
	const isExternal = $derived(/^(https?:)?\/\//.test(href));
</script>

{#if isExternal}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} target="_blank" rel="noopener noreferrer" class={styles} {...rest}>
		{@render children()}
	</a>
{:else}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} class={styles} {...rest}>
		{@render children()}
	</a>
{/if}
