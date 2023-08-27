<script lang="ts">
	import { Alert, Badge, Button, Card, Heading } from 'flowbite-svelte';

	export let data;
</script>

<div class="flex w-full flex-col items-center justify-center gap-2">
	<div class="mb-2 flex flex-row gap-4">
		<Heading tag="h3">Groups</Heading>
		<Button href="/groups/add">Add</Button>
	</div>
	{#if data.groups.length > 0}
		<div class="grid grid-cols-1 gap-1 sm:grid-cols-3 md:grid-cols-5">
			{#each data.groups as group}
				<Card href="/groups/{group.id}">
					<div class="flex flex-col items-center justify-center gap-2">
						<h2>{group.title}</h2>
						{#if group.limit && group.limit > 0}
							<Badge>Limit {group.limit}</Badge>
						{/if}
					</div>
				</Card>
			{/each}
		</div>
	{:else}
		<Alert class="w-max-48 text-center" color="red">No groups found</Alert>
	{/if}
</div>
