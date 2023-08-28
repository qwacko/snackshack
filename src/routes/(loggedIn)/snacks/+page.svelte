<script lang="ts">
	import { Button, Card, Heading } from 'flowbite-svelte';

	export let data;
</script>

<div class=" flex w-full flex-col items-center gap-10 p-4">
	<div class="mb-2 flex flex-row justify-center gap-4">
		<Heading tag="h3">Snacks</Heading>
		<Button href="/snacks/add">Add</Button>
	</div>
	{#each data.snackGroups as group}
		{@const snacksInGroup = data.snacks.filter((snack) => snack.snackGroupId === group.id)}
		<div class="flex flex-col items-center gap-2">
			<div class="mb-2 flex flex-row justify-center gap-4">
				<Heading tag="h4">{group.title}</Heading>
			</div>

			<div class="flex grid-cols-10 gap-2">
				{#each snacksInGroup as snack}
					<Card href="/snacks/{snack.id}">
						<p>{snack.title}</p>
					</Card>
				{/each}
			</div>
		</div>
	{/each}
</div>
