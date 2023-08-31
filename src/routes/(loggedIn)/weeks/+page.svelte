<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { weeksSchema } from '$lib/schema/paramsWeeksSchema.js';
	import { validatedSearchParamsStore } from '$lib/sveltekitSearchParams.js';
	import { Button, Alert, Badge, Accordion, AccordionItem } from 'flowbite-svelte';
	import { addDays } from '$lib/dateHelper.js';
	import PrevIcon from '$lib/components/icons/PrevIcon.svelte';
	import NextIcon from '$lib/components/icons/NextIcon.svelte';
	import TodayIcon from '$lib/components/icons/TodayIcon.svelte';
	import { enhance } from '$app/forms';
	import Card from '$lib/components/Card.svelte';
	import { Card as FBCard } from 'flowbite-svelte';
	import SnackImage from '$lib/components/SnackImage.svelte';
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';

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
