<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert, Badge, Accordion, AccordionItem } from 'flowbite-svelte';
	import { addDays } from '$lib/addDays';
	import { enhance } from '$app/forms';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import DateNavigator from '$lib/components/DateNavigator.svelte';

	export let data;

	const searchParams = validatedSearchParamsStore(weeksSchema.passthrough().parse);

	$: thisWeek = addDays(new Date(), 0).toISOString().slice(0, 10);
	$: nextWeek = addDays(data.targetWeekInfo.endDate, 1).toISOString().slice(0, 10);
	$: prevWeek = addDays(data.targetWeekInfo.startDate, -1).toISOString().slice(0, 10);
</script>

<PageLayout title="Weeks" size="lg">
	<DateNavigator
		{...data.targetWeekInfo}
		prevWeekURL={$searchParams.updateSearch({ date: prevWeek })}
		nextWeekURL={$searchParams.updateSearch({ date: nextWeek })}
		thisWeekURL={$searchParams.updateSearch({ date: thisWeek })}
		orderingOpen={data.targetWeekInfo.canOrder}
		daysToEnd={data.targetWeekInfo.daysToEndOfOrdering}
	/>
	{#if !data.weekData}
		<div class="flex self-center"><Alert color="red">No Data For Week Yet</Alert></div>
		{#if data.loggedInUser?.admin}
			{#if data.targetWeekInfo.allowWeekCreation}
				<div class="flex self-center">
					<form action="?/createWeek" method="POST" use:enhance>
						<input type="hidden" name="date" value={$searchParams.value.date} />
						<Button type="submit" outline>Create Week</Button>
					</form>
				</div>
			{/if}
		{/if}
	{:else}
		<div class="flex w-full flex-col items-center gap-4">
			<Accordion class="w-full">
				<AccordionItem>
					<div slot="header">On Sale</div>
					<div class="flex flex-row items-stretch justify-center gap-2">
						{#each data.weekData.options.filter((opt) => opt.special) as currentOption}
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
					</div>
				</AccordionItem>
				<AccordionItem>
					<div slot="header">Normal Price</div>
					<div class="flex flex-row items-stretch justify-center gap-2">
						{#each data.weekData.options.filter((opt) => !opt.special) as currentOption}
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
					</div>
				</AccordionItem>
				<AccordionItem>
					<div slot="header">Excluded Snacks</div>
					<div class="flex flex-row items-stretch justify-center gap-2">
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
					</div>
				</AccordionItem>
				{#if data.usersWithOrder}
					{#each data.usersWithOrder as currentUser}
						{@const userOrderItems = data.weekData.orders.filter(
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
							<div class="flex flex-row items-stretch justify-center gap-2">
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
							</div>
						</AccordionItem>
					{/each}
				{/if}
			</Accordion>
		</div>
	{/if}
</PageLayout>
