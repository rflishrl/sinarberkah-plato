<script lang="ts">
	interface Props {
		data: Record<string, unknown>;
	}

	let { data }: Props = $props();

	const scriptTag = $derived(
		`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}<` +
			'/script>'
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html scriptTag}
