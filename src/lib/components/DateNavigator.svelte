<script lang="ts">
	import NextIcon from '$lib/components/icons/NextIcon.svelte';
	import PrevIcon from '$lib/components/icons/PrevIcon.svelte';
	import TodayIcon from '$lib/components/icons/TodayIcon.svelte';
	import { Badge, Button } from 'flowbite-svelte';

	export let showNextPeriod: boolean;
	export let prevPeriodURL: string;
	export let nextPeriodURL: string;
	export let thisPeriodURL: string;
	export let isCurrent: boolean;
	export let startDate: Date;
	export let endDate: Date;

	export let orderingOpen: boolean;
	export let daysToEnd: number;
</script>

<div class="flex flex-row items-center justify-center gap-2">
	<div class="flex w-10 flex-row justify-center" />
	<div class="flex w-10 flex-row justify-center">
		<Button href={prevPeriodURL} outline class="p-2">
			<PrevIcon />
		</Button>
	</div>
	<div class="flex w-52 flex-col items-center gap-1">
		{#if orderingOpen}
			<Badge color="green">
				Ordering Open. {daysToEnd} days left
			</Badge>
		{:else}
			<Badge color="red">Ordering Closed</Badge>
		{/if}
		{#if isCurrent}
			<Badge color="green">Current</Badge>
		{:else}
			<div class="flex flex-row items-center justify-center gap-2">
				<div class="flex">
					{startDate.toLocaleDateString('en-US', { day: 'numeric' })}
					{startDate.toLocaleDateString('en-US', { month: 'short' })}
				</div>
				<div class="flex">to</div>
				<div class="flex">
					{endDate.toLocaleDateString('en-US', { day: 'numeric' })}
					{endDate.toLocaleDateString('en-US', { month: 'short' })}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex w-10 flex-row justify-center">
		{#if showNextPeriod}
			<Button href={nextPeriodURL} outline class="p-2">
				<NextIcon />
			</Button>
		{/if}
	</div>
	<div class="flex w-10">
		{#if !isCurrent}
			<Button href={thisPeriodURL} outline class="p-2">
				<TodayIcon />
			</Button>
		{/if}
	</div>
</div>
