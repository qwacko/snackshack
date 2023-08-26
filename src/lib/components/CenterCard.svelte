<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import Center from './Center.svelte';

	export let title: string | null;
</script>

<Center>
	<Card class="m-10 w-full max-w-md">
		{#if title}<h3 class="pb-4 text-xl font-medium text-gray-900 dark:text-white">{title}</h3>{/if}
		<slot />
	</Card>
</Center>
