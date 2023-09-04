<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { orderingPeriodSchema } from '$lib/schema/paramsOrderingPeriodSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert, Badge, Accordion, AccordionItem } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import DateNavigator from '$lib/components/DateNavigator.svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';

	export let data;

	const searchParams = validatedSearchParamsStore(orderingPeriodSchema.passthrough().parse);

	$: thisPeriod = new Date().toISOString().slice(0, 10);
	$: nextPeriod = data.targetOrderingPeriodInfo.nextPeriodMid.toISOString().slice(0, 10);
	$: prevPeriod = data.targetOrderingPeriodInfo.prevPeriodMid.toISOString().slice(0, 10);
</script>

<PageLayout title={data.orderingTexts.plural} size="lg">
	<DateNavigator
		{...data.targetOrderingPeriodInfo}
		prevPeriodURL={$searchParams.updateSearch({ date: prevPeriod })}
		nextPeriodURL={$searchParams.updateSearch({ date: nextPeriod })}
		thisPeriodURL={$searchParams.updateSearch({ date: thisPeriod })}
		orderingOpen={data.targetOrderingPeriodInfo.canOrder}
		daysToEnd={data.targetOrderingPeriodInfo.daysToEndOfOrdering}
	/>
	{#if !data.orderingPeriodData}
		<div class="flex self-center">
			<Alert color="red">No Data For This {data.orderingTexts.single} Yet</Alert>
		</div>
		{#if data.loggedInUser?.admin}
			{#if data.targetOrderingPeriodInfo.allowOrderingPeriodCreation}
				<div class="flex self-center">
					<form action="?/createPeriod" method="POST" use:enhance>
						<input type="hidden" name="date" value={$searchParams.value.date} />
						<Button type="submit" outline>Create {data.orderingTexts.single}</Button>
					</form>
				</div>
			{/if}
		{/if}
	{:else}
		<div class="flex w-full flex-col items-center gap-4">
			{#if data.targetOrderingPeriodInfo.allowOrderingPeriodCreation}
				<Button href="/orderingPeriods/{data.orderingPeriodData.id}/recreate" outline
					>Reset {data.orderingTexts.single}</Button
				>
			{/if}
			<Accordion class="w-full">
				<AccordionItem>
					<div slot="header">On Sale</div>
					<SnackArrangement>
						{#each data.orderingPeriodData.options.filter((opt) => opt.special) as currentOption}
							<DisplaySnack
								limit={currentOption.snack.maxQuantity}
								normalPrice={currentOption.snack.priceCents}
								specialPrice={currentOption.priceCents}
								title={currentOption.snack.title}
								imageFilename={currentOption.snack.imageFilename}
								special={currentOption.special}
								disabled={false}
							/>
						{/each}
					</SnackArrangement>
				</AccordionItem>
				<AccordionItem>
					<div slot="header">Normal Price</div>
					<SnackArrangement>
						{#each data.orderingPeriodData.options.filter((opt) => !opt.special) as currentOption}
							<DisplaySnack
								limit={currentOption.snack.maxQuantity}
								normalPrice={currentOption.snack.priceCents}
								specialPrice={currentOption.priceCents}
								title={currentOption.snack.title}
								imageFilename={currentOption.snack.imageFilename}
								special={currentOption.special}
								disabled={false}
							/>
						{/each}
					</SnackArrangement>
				</AccordionItem>
				<AccordionItem>
					<div slot="header">Excluded Snacks</div>
					<SnackArrangement>
						{#if data.excludedSnacks}
							{#each data.excludedSnacks as currentOption}
								<DisplaySnack
									limit={currentOption.maxQuantity}
									normalPrice={currentOption.priceCents}
									specialPrice={currentOption.salePrice}
									title={currentOption.title}
									imageFilename={currentOption.imageFilename}
									special={false}
									disabled={true}
								/>
							{/each}
						{/if}
					</SnackArrangement>
				</AccordionItem>
				{#if data.usersWithOrder}
					{#each data.usersWithOrder as currentUser}
						{@const userOrderItems = data.orderingPeriodData.orders.filter(
							(order) => order.userOrderConfig.user.id === currentUser.id
						)}
						{@const userSpend = userOrderItems.reduce(
							(acc, orderItem) => acc + orderItem.snack.priceCents,
							0
						)}
						<AccordionItem>
							<div slot="header">
								{currentUser.name} Order - ${(userSpend / 100.0).toFixed(2)}
							</div>
							<SnackArrangement>
								{#each userOrderItems as currentOrderItem}
									<DisplaySnack
										disabled={false}
										special={currentOrderItem.snack.special}
										imageFilename={currentOrderItem.snack.snack.imageFilename}
										limit={currentOrderItem.snack.snack.maxQuantity}
										normalPrice={currentOrderItem.snack.snack.priceCents}
										priceCents={currentOrderItem.snack.priceCents}
										title={currentOrderItem.snack.snack.title}
									/>
								{/each}
							</SnackArrangement>
						</AccordionItem>
					{/each}
				{/if}
			</Accordion>
		</div>
	{/if}
</PageLayout>
