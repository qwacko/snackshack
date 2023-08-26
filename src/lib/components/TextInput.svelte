<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let required: boolean | undefined | null = undefined;
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
	<Input {...$$restProps} {name} {required} />
	<ErrorText message={errorMessage} />
</Label>
