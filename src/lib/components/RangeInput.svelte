<script lang="ts">
	import { Button, Input, Label, Range } from 'flowbite-svelte';
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let required: boolean | undefined | null = undefined;
	export let value: number | undefined | null;
	export let initialValue: number = 0;
	export let initialValueText: string = 'Initialize';
</script>

<Label class="space-y-2">
	{#if title}
		<span class="flex flex-row gap-1"
			><div>
				{title}
			</div>
			<div>
				{#if required}
					*{/if}
			</div></span
		>
	{/if}
	{#if value === undefined || value === null}
		<Button on:click={() => (value = initialValue)} outline>{initialValueText}</Button>
	{:else}
		<Range bind:value {...$$restProps} {name} {required} />
	{/if}
	<ErrorText message={errorMessage} />
</Label>
