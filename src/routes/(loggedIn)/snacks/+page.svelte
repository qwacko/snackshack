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
					<Card href="/snacks/{snack.id}">
						<div class="flex flex-col items-center justify-center">
							<div class="flex">{snack.title}</div>
							<div class="flex flex-row gap-1">
								{#if snackLimit !== undefined}
									<Badge color="red">Limit {snackLimit}</Badge>
								{/if}
								<Badge>${(snack.priceCents / 100.0).toFixed(2)}</Badge>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		</div>
	{/each}
</PageLayout>
