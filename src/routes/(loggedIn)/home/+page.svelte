<script lang="ts">
	import { enhance } from '$app/forms';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { addDays } from '$lib/addDays';
	import DateNavigator from '$lib/components/DateNavigator.svelte';

	import { orderingPeriodSchema } from '$lib/schema/paramsOrderingPeriodSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';

	import { Accordion, AccordionItem, Badge, Progressbar } from 'flowbite-svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';

	export let data;
	const searchParams = validatedSearchParamsStore(orderingPeriodSchema.passthrough().parse);

	$: thisPeriod = new Date().toISOString().slice(0, 10);
	$: nextPeriod = data.orderingInfo.dateInformation.nextPeriodMid.toISOString().slice(0, 10);
	$: prevPeriod = data.orderingInfo.dateInformation.prevPeriodMid.toISOString().slice(0, 10);

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
		{...data.orderingInfo.dateInformation}
		prevPeriodURL={$searchParams.updateSearch({ date: prevPeriod })}
		nextPeriodURL={$searchParams.updateSearch({ date: nextPeriod })}
		thisPeriodURL={$searchParams.updateSearch({ date: thisPeriod })}
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

						<SnackArrangement>
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
						</SnackArrangement>
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
						<SnackArrangement>
							{#each groupOptions as currentOption}
								<form action="?/addSnack" method="POST" class="flex" use:enhance>
									<input type="hidden" name="snackId" value={currentOption.id} />
									<input type="hidden" name="orderingPeriodId" value={data.orderingInfo.periodId} />
									<input type="hidden" name="userId" value={data.loggedInUser?.userId} />
									<button type="submit" disabled={currentOption.disabled || !canOrder}>
										<DisplaySnack {...currentOption} class="h-full" />
									</button>
								</form>
							{/each}
						</SnackArrangement>
					</AccordionItem>
				{/each}
			{/if}
		</Accordion>
	{:else}
		<Badge color="red">No ordering information available</Badge>
	{/if}
</PageLayout>
