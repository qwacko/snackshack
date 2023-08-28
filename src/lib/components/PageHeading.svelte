<script lang="ts">
	import { Heading } from 'flowbite-svelte';

	export let title: string;
</script>

<div class="flex flex-row items-end justify-center gap-4 p-2">
	<slot name="before" />
	<h3 class="text-4xl font-bold">{title}</h3>
	<slot />
</div>
