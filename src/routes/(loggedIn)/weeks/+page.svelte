<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert, Badge } from 'flowbite-svelte';
	import { addDays } from '$lib/dateHelper.js';
	import PrevIcon from '$lib/components/icons/PrevIcon.svelte';
	import NextIcon from '$lib/components/icons/NextIcon.svelte';
	import TodayIcon from '$lib/components/icons/TodayIcon.svelte';
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import { Card as FBCard } from 'flowbite-svelte';
	import SnackImage from '$lib/components/SnackImage.svelte';

	export let data;

	const searchParams = validatedSearchParamsStore(weeksSchema.passthrough().parse);

	$: thisWeek = addDays(new Date(), 0).toISOString().slice(0, 10);
	$: nextWeek = addDays(data.targetWeekInfo.endDate, 1).toISOString().slice(0, 10);
	$: prevWeek = addDays(data.targetWeekInfo.startDate, -1).toISOString().slice(0, 10);
</script>

<PageLayout title="Weeks" size="lg">
	<div class="flex flex-row items-center justify-center gap-2">
		<div class="flex w-10 flex-row justify-center" />
		<div class="flex w-10 flex-row justify-center">
			{#if data.targetWeekInfo.showPrevWeek}
				<Button href={$searchParams.updateSearch({ date: prevWeek })} outline class="p-2"
					><PrevIcon /></Button
				>
			{/if}
		</div>
		<div class="flex w-36 flex-row justify-center gap-2">
			{#if data.targetWeekInfo.isThisWeek}
				<div class="flex text-center">This Week</div>
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
		</div>

		<div class="flex w-10 flex-row justify-center">
			{#if data.targetWeekInfo.showNextWeek}
				<Button href={$searchParams.updateSearch({ date: nextWeek })} outline class="p-2"
					><NextIcon /></Button
				>
			{/if}
		</div>
		<div class="flex w-10">
			{#if !data.targetWeekInfo.isThisWeek}
				<Button href={$searchParams.updateSearch({ date: thisWeek })} outline class="p-2"
					><TodayIcon /></Button
				>
			{/if}
		</div>
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
		<div class="flex flex-col items-center gap-4">
			<div class="flex text-2xl">Week Options</div>
			<div class="flex text-xl">On Sale</div>
			<div class="flex flex-row gap-2">
				{#each data.weekData.options.filter((opt) => opt.special) as currentOption}
					<FBCard>
						<div class="flex flex-row items-center gap-2">
							<SnackImage
								imageFilename={currentOption.snack.imageFilename}
								snackTitle={currentOption.snack.title}
							/>
							<div class="flex flex-col items-center gap-2">
								<div class="flex">{currentOption.snack.title}</div>
								<div class="flex flex-row gap-1">
									<Badge color="yellow">
										<div class="flex flex-row gap-1">
											<div class="line-through">
												${(currentOption.snack.priceCents / 100.0).toFixed(2)}
											</div>
											${(currentOption.priceCents / 100.0).toFixed(2)}
										</div>
									</Badge>
								</div>
							</div>
						</div>
					</FBCard>
				{/each}
			</div>

			<div class="flex text-xl">Normal Price</div>
			<div class="flex flex-row gap-2">
				{#each data.weekData.options.filter((opt) => !opt.special) as currentOption}
					<FBCard>
						<div class="flex flex-row items-center gap-2">
							<SnackImage
								imageFilename={currentOption.snack.imageFilename}
								snackTitle={currentOption.snack.title}
							/>
							<div class="flex flex-col items-center gap-2">
								<div class="">{currentOption.snack.title}</div>
								<div class="flex flex-row gap-1">
									<Badge color="green">
										<div class="flex flex-row gap-1">
											${(currentOption.priceCents / 100.0).toFixed(2)}
										</div>
									</Badge>
								</div>
							</div>
						</div>
					</FBCard>
				{/each}
			</div>
			<div class="flex text-xl">Excluded Snacks</div>
			<div class="flex flex-row gap-2">
				{#if data.excludedSnacks}
					{#each data.excludedSnacks as currentOption}
						<FBCard>
							<div class="flex flex-row items-center gap-2">
								<SnackImage
									imageFilename={currentOption.imageFilename}
									snackTitle={currentOption.title}
								/>
								<div class="flex flex-col items-center gap-2">
									<div class="">{currentOption.title}</div>
								</div>
							</div>
						</FBCard>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</PageLayout>
