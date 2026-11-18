<script lang="ts">
	import SectionHeading from './SectionHeading.svelte';

	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<div class="bg-surface py-12 lg:py-16">
	<div class="container-page">
		<SectionHeading as="h1" {title} {description} class="[&_h1]:sm:text-4xl" />
	</div>
</div>
