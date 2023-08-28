<script lang="ts">
	import { Button, Checkbox, Input, Label, Range } from 'flowbite-svelte';
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let required: boolean | undefined | null = undefined;
	export let value: boolean | undefined;
	export let message = title;
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
	<Checkbox checked={value} {name} on:click={() => (value = !value)}>{message}</Checkbox>
	<ErrorText message={errorMessage} />
</Label>
