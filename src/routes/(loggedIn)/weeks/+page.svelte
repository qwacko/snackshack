<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert, Badge, Accordion, AccordionItem } from 'flowbite-svelte';
	import { addDays } from '$lib/addDays';
	import { enhance } from '$app/forms';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import DateNavigator from '$lib/components/DateNavigator.svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';

	export let data;

	const searchParams = validatedSearchParamsStore(weeksSchema.passthrough().parse);

	$: thisWeek = data.targetWeekInfo.midPeriod.toISOString().slice(0, 10);
	$: nextWeek = data.targetWeekInfo.nextPeriodMid.toISOString().slice(0, 10);
	$: prevWeek = data.targetWeekInfo.nextPeriodMid.toISOString().slice(0, 10);
</script>

<PageLayout title="Weeks" size="lg">
	<DateNavigator
		{...data.targetWeekInfo}
		prevPeriodURL={$searchParams.updateSearch({ date: prevWeek })}
		nextPeriodURL={$searchParams.updateSearch({ date: nextWeek })}
		thisPeriodURL={$searchParams.updateSearch({ date: thisWeek })}
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
			{#if data.targetWeekInfo.allowWeekCreation}
				<Button href="/weeks/{data.weekData.id}/recreate" outline>Reset Week</Button>
			{/if}
			<Accordion class="w-full">
				<AccordionItem>
					<div slot="header">On Sale</div>
					<SnackArrangement>
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
					</SnackArrangement>
				</AccordionItem>
				<AccordionItem>
					<div slot="header">Normal Price</div>
					<SnackArrangement>
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
