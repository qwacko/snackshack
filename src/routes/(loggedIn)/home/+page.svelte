<script lang="ts">
	import { enhance } from '$app/forms';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { addDays } from '$lib/addDays';
	import DateNavigator from '$lib/components/DateNavigator.svelte';

	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';

	import { Accordion, AccordionItem, Badge, Progressbar } from 'flowbite-svelte';

	export let data;
	const searchParams = validatedSearchParamsStore(weeksSchema.passthrough().parse);

	$: thisWeek = addDays(new Date(), 0).toISOString().slice(0, 10);
	$: nextWeek = addDays(data.targetWeekInfo.endDate, 1).toISOString().slice(0, 10);
	$: prevWeek = addDays(data.targetWeekInfo.startDate, -1).toISOString().slice(0, 10);

	$: spendingInfo = data.orderingInfo?.spendingInfo
		? {
				spent: (data.orderingInfo.spendingInfo.totalSpent / 100.0).toFixed(2),
				totalSpend: (data.orderingInfo.spendingInfo.userSpend / 100.0).toFixed(2),
				remainingSpend: (data.orderingInfo.spendingInfo.remainingSpend / 100.0).toFixed(2),
				progress: (
					(data.orderingInfo.spendingInfo.totalSpent / data.orderingInfo.spendingInfo.userSpend) *
					100.0
				).toString()
		  }
		: undefined;

	$: canOrder = data.orderingInfo?.dateInformation?.canOrder || false;
</script>

<PageLayout title="Home">
	<DateNavigator
		{...data.targetWeekInfo}
		prevWeekURL={$searchParams.updateSearch({ date: prevWeek })}
		nextWeekURL={$searchParams.updateSearch({ date: nextWeek })}
		thisWeekURL={$searchParams.updateSearch({ date: thisWeek })}
		orderingOpen={canOrder}
		daysToEnd={data.orderingInfo?.dateInformation?.daysToEndOfOrdering || 0}
	/>
	{#if data.orderingInfo && ((spendingInfo && data.orderingInfo.spendingInfo) || data.orderingInfo.groupInfo)}
		<Accordion multiple>
			{#if spendingInfo && data.orderingInfo.spendingInfo}
				<AccordionItem>
					<div slot="header" class="mr-4 flex w-full flex-row items-center gap-4">
						<div class="flex whitespace-nowrap">Current Order</div>
						<Progressbar progress={spendingInfo.progress} class="flex flex-grow" />
					</div>
					<div class="flex w-full flex-col items-center gap-4">
						<div class="flex flex-row items-center gap-2">
							<div class="flex self-center">
								${(data.orderingInfo.spendingInfo.totalSpent / 100.0).toFixed(2)} / ${(
									data.orderingInfo.spendingInfo.userSpend / 100.0
								).toFixed(2)} (${(data.orderingInfo.spendingInfo.remainingSpend / 100.0).toFixed(2)}
								remaining)
							</div>
						</div>

						<div class="flex flex-row flex-wrap justify-center gap-2 self-center">
							{#each data.orderingInfo.currentOrderItems as currentOrder}
								<form class="flex" action="?/removeSnack" method="POST" use:enhance>
									<input type="hidden" name="id" value={currentOrder.id} />
									<button type="submit" disabled={!canOrder}>
										<DisplaySnack
											title={currentOrder.snackTitle}
											imageFilename={currentOrder.snackImageFilename}
											priceCents={currentOrder.snackPrice}
											specialPrice={currentOrder.snackPrice}
											special={currentOrder.snackSpecial}
											disabled={false}
											limit={0}
											normalPrice={currentOrder.snackNormalPrice}
											class="h-full"
										/>
									</button>
								</form>
							{/each}
						</div>
					</div>
				</AccordionItem>
			{/if}

			{#if data.orderingInfo.groupInfo}
				{#each data.orderingInfo.groupInfo as currentGroup}
					{@const groupOptions = data.orderingInfo.snackInfo.filter(
						(x) => x.groupId === currentGroup.id
					)}
					<AccordionItem>
						<div class="flex flex-row gap-2" slot="header">
							<div class="flex">{currentGroup.title}</div>
							{#if currentGroup.limit}
								<Badge color="red">Limit {currentGroup.limit}</Badge>
								{#if currentGroup.limitReached}
									<Badge color="red">Limit Reached</Badge>
								{/if}
							{/if}
						</div>
						<div class="flex flex-row flex-wrap items-stretch justify-center gap-2">
							{#each groupOptions as currentOption}
								<form action="?/addSnack" method="POST" class="flex" use:enhance>
									<input type="hidden" name="snackId" value={currentOption.id} />
									<input type="hidden" name="weekId" value={data.orderingInfo.weekId} />
									<input type="hidden" name="userId" value={data.loggedInUser?.userId} />
									<button type="submit" disabled={currentOption.disabled || !canOrder}>
										<DisplaySnack {...currentOption} class="h-full" />
									</button>
								</form>
							{/each}
						</div>
					</AccordionItem>
				{/each}
			{/if}
		</Accordion>
	{:else}
		<Badge color="red">No ordering information available</Badge>
	{/if}
</PageLayout>
