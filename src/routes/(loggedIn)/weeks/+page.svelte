<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert } from 'flowbite-svelte';
	import { addDays } from '$lib/dateHelper.js';
	import PrevIcon from '$lib/components/icons/PrevIcon.svelte';
	import NextIcon from '$lib/components/icons/NextIcon.svelte';
	import TodayIcon from '$lib/components/icons/TodayIcon.svelte';
	import { enhance } from '$app/forms';

	export let data;

	const searchParams = validatedSearchParamsStore(weeksSchema.passthrough().parse);

	$: thisWeek = addDays(new Date(), 0).toISOString().slice(0, 10);
	$: nextWeek = addDays(data.targetWeekInfo.endDate, 1).toISOString().slice(0, 10);
	$: prevWeek = addDays(data.targetWeekInfo.startDate, -1).toISOString().slice(0, 10);
</script>

<PageLayout title="Weeks" size="lg">
	<div class="flex flex-row items-center justify-center gap-2">
		{#if data.targetWeekInfo.showPrevWeek}
			<Button href={$searchParams.updateSearch({ date: prevWeek })} outline class="p-2"
				><PrevIcon /></Button
			>
		{/if}
		{#if data.targetWeekInfo.isThisWeek}
			<div class="flex">This Week</div>
		{:else}
			<div class="flex">
				{data.targetWeekInfo.startDate.toLocaleDateString('en-US', { day: 'numeric' })}
				{data.targetWeekInfo.startDate.toLocaleDateString('en-US', { month: 'short' })}
			</div>
			<div class="flex">to</div>
			<div class="flex">
				{data.targetWeekInfo.endDate.toLocaleDateString('en-US', { day: 'numeric' })}
				{data.targetWeekInfo.endDate.toLocaleDateString('en-US', { month: 'short' })}
			</div>
		{/if}
		{#if !data.targetWeekInfo.isThisWeek}
			<Button href={$searchParams.updateSearch({ date: thisWeek })} outline class="p-2"
				><TodayIcon /></Button
			>
		{/if}
		{#if data.targetWeekInfo.showNextWeek}
			<Button href={$searchParams.updateSearch({ date: nextWeek })} outline class="p-2"
				><NextIcon /></Button
			>
		{/if}
	</div>

	{#if !data.weekData}
		<div class="flex self-center"><Alert color="red">No Data For Week Yet</Alert></div>
		{#if data.targetWeekInfo.allowWeekCreation}
			<div class="flex self-center">
				<form action="?/createWeek" method="POST" use:enhance>
					<input type="hidden" name="date" value={$searchParams.value.date} />
					<Button type="submit" outline>Create Week</Button>
				</form>
			</div>
		{/if}
	{:else}
		{JSON.stringify(data.weekData)}
	{/if}
</PageLayout>
