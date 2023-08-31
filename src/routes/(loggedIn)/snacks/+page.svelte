<script lang="ts">
	import DisplaySnack from '$lib/components/DisplaySnack.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SnackImage from '$lib/components/SnackImage.svelte';
	import { Button, Badge, Card, Heading } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Snacks" size="lg">
	{#if data.loggedInUser?.admin}
		<Button class="self-center" href="/snacks/add" outline>Add</Button>
	{/if}
	{#each data.snackGroups as group}
		{@const snacksInGroup = data.snacks.filter((snack) => snack.snackGroupId === group.id)}
		{@const groupLimit = group.limit ? group.limit : undefined}
		<div class="flex flex-col items-center gap-2 pt-4">
			<div class="mb-2 flex flex-row justify-center gap-4">
				<Heading tag="h4">{group.title}</Heading>
				{#if groupLimit !== undefined}
					<Badge color="red">Limit {groupLimit}</Badge>
				{/if}
			</div>

			<div class="flex grid-cols-10 gap-2">
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
			</div>
		</div>
	{/each}
</PageLayout>
