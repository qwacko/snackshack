<script lang="ts">
	import NextIcon from '$lib/components/icons/NextIcon.svelte';
	import PrevIcon from '$lib/components/icons/PrevIcon.svelte';
	import TodayIcon from '$lib/components/icons/TodayIcon.svelte';
	import { Badge, Button } from 'flowbite-svelte';

	export let showPrevWeek: boolean;
	export let showNextWeek: boolean;
	export let prevWeekURL: string;
	export let nextWeekURL: string;
	export let thisWeekURL: string;
	export let isThisWeek: boolean;
	export let isNextWeek: boolean;
	export let startDate: Date;
	export let endDate: Date;

	export let orderingOpen: boolean;
	export let daysToEnd: number;
</script>

<div class="flex flex-row items-center justify-center gap-2">
	<div class="flex w-10 flex-row justify-center" />
	<div class="flex w-10 flex-row justify-center">
		{#if showPrevWeek}
			<Button href={prevWeekURL} outline class="p-2">
				<PrevIcon />
			</Button>
		{/if}
	</div>
	<div class="flex w-52 flex-col items-center gap-1">
		{#if orderingOpen}
			<Badge color="green">
				Ordering Open. {daysToEnd} days left
			</Badge>
		{:else}
			<Badge color="red">Ordering Closed</Badge>
		{/if}
		{#if isThisWeek}
			<div class="flex text-center">This Week</div>
		{:else if isNextWeek}
			<div class="flex text-center">Next Week</div>
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
		{#if showNextWeek}
			<Button href={nextWeekURL} outline class="p-2">
				<NextIcon />
			</Button>
		{/if}
	</div>
	<div class="flex w-10">
		{#if !isThisWeek}
			<Button href={thisWeekURL} outline class="p-2">
				<TodayIcon />
			</Button>
		{/if}
	</div>
</div>
