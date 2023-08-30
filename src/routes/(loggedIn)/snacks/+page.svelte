<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Button, Badge, Card, Heading } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Snacks" size="lg">
	<Button class="self-center" href="/snacks/add" outline>Add</Button>
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
					<Card href="/snacks/{snack.id}" class={disabled ? 'bg-gray-100' : ''}>
						<div class="flex flex-col items-center justify-center gap-1">
							<div class="flex">{snack.title}</div>
							<div class="flex flex-row gap-1">
								{#if snackLimit !== undefined}
									<Badge color="red">Limit {snackLimit}</Badge>
								{/if}
								<Badge>${(snack.priceCents / 100.0).toFixed(2)}</Badge>
								{#if disabled}
									<Badge color="red">Disabled</Badge>
								{/if}
							</div>
							<div class="flex flex-row gap-1">
								<Badge color="green">{snack.availablePercentage}% Available</Badge>
								{#if snack.salePercentage !== 0 && snack.salePrice > 0}
									<Badge color="yellow"
										>{snack.salePercentage}% Sale (${(snack.salePrice / 100.0).toFixed(2)})</Badge
									>
								{/if}
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	{/each}
</PageLayout>
