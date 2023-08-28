<script lang="ts">
	import PageHeading from './PageHeading.svelte';

	export let title: string | undefined = undefined;
	export let subtitle: string | undefined = undefined;
	export let size: 'sm' | 'lg' | 'xs' = 'lg';
</script>

<div class="flex w-full justify-center px-4">
	<div
		class="flex w-full flex-col items-stretch gap-4"
		class:max-w-4xl={size === 'lg'}
		class:max-w-xl={size === 'sm'}
		class:max-w-xs={size === 'xs'}
	>
		{#if title}
			<PageHeading {title}><slot name="heading" /></PageHeading>
		{/if}
		{#if subtitle}
			<h5 class="flex justify-center text-xl font-bold">{subtitle}</h5>
		{/if}
		<slot />
	</div>
</div>
