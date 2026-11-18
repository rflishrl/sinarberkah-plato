<script lang="ts">
	interface Props {
		serverYear: number;
	}

	let { serverYear }: Props = $props();
	let year = $derived(typeof window === 'undefined' ? serverYear : new Date().getFullYear());
</script>

{year}
