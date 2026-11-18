<script lang="ts">
	interface Props {
		message: string;
	}

	let { message }: Props = $props();
</script>

<p class="mx-auto max-w-md py-16 text-center text-muted" role="status">
	{message}
</p>
