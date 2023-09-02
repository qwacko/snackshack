<script lang="ts">
	import { Badge, Card } from 'flowbite-svelte';
	import SnackImage from './SnackImage.svelte';

	export let disabled: boolean | undefined = undefined;
	export let special: boolean | undefined = undefined;
	export let title: string;
	export let imageFilename: string | undefined | null = undefined;
	export let normalPrice: number;
	export let limit: number | undefined | null;
	export let availablePercent: number | undefined = undefined;
	export let specialPercent: number | undefined = undefined;
	export let specialPrice: number | undefined = undefined;
	export let limitReached: boolean | undefined = undefined;
</script>

<Card color={disabled ? 'red' : special ? 'yellow' : undefined} class={$$props.class}>
	<div class="flex flex-col items-center justify-center gap-2">
		<SnackImage {imageFilename} snackTitle={title} />
		<h2>{title}</h2>
		{#if special && specialPrice}
			<Badge color="yellow">
				<div class="flex flex-row gap-1">
					<div class="flex line-through">
						${(normalPrice / 100.0).toFixed(2)}
					</div>
					<div class="flex">
						${(specialPrice / 100.0).toFixed(2)}
					</div>
				</div>
			</Badge>
		{:else if normalPrice}
			<Badge>${(normalPrice / 100.0).toFixed(2)}</Badge>
		{/if}
		<div class="flex flex-row gap-1">
			{#if limit}
				<Badge color="red">Limit {limit}</Badge>
			{/if}
			{#if limit && limitReached}
				<Badge color="red">Limit Reached</Badge>
			{/if}
			{#if availablePercent !== undefined}
				<Badge color="green">{availablePercent}% Available</Badge>
			{/if}
			{#if specialPercent !== undefined && specialPrice !== undefined && specialPrice !== 0 && specialPercent !== 0}
				<Badge color="yellow">{specialPercent}% Sale (${(specialPrice / 100.0).toFixed(2)})</Badge>
			{/if}
		</div>
	</div>
</Card>
