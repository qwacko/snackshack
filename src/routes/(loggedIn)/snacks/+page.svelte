<script lang="ts">
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';
	import { Button, Badge, Accordion, AccordionItem } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Snacks" size="lg">
	{#if data.loggedInUser?.admin}
		<Button class="self-center" href="/snacks/add" outline>Add</Button>
	{/if}
	<Accordion>
		{#each data.snackGroups as group}
			{@const snacksInGroup = data.snacks.filter((snack) => snack.snackGroupId === group.id)}
			{#if snacksInGroup.length > 0}
				<AccordionItem>
					<div class="flex flex-row items-center gap-4" slot="header">
						<div class="flex">{group.title}</div>
						{#if group.limit}
							<Badge color="red" class="whitespace-nowrap">Limit {group.limit}</Badge>
						{/if}
					</div>

					<SnackArrangement>
						{#each snacksInGroup as snack}
							{@const snackLimit = snack.maxQuantity ? snack.maxQuantity : undefined}
							{@const disabled = !snack.enabled || snack.priceCents === 0}
							<a href="/snacks/{snack.id}">
								<DisplaySnack
									{disabled}
									special={false}
									imageFilename={snack.imageFilename}
									limit={snackLimit}
									priceCents={snack.priceCents}
									snackTitle={snack.title}
									normalPrice={snack.priceCents}
									title={snack.title}
									availablePercent={snack.availablePercentage}
									specialPercent={snack.salePercentage}
									specialPrice={snack.salePrice}
								/></a
							>
						{/each}
					</SnackArrangement>
				</AccordionItem>
			{/if}
		{/each}
	</Accordion>
</PageLayout>
