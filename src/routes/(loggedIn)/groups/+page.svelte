<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Alert, Badge, Button, Card, Heading } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Groups" size="lg">
	{#if data.loggedInUser?.user.admin}
		<Button href="/groups/add" outline class="self-center">Add</Button>
	{/if}
	{#if data.groups.length > 0}
		<div class="flex flex-row items-stretch justify-center gap-4">
			{#each data.groups as group}
				<Card href={data.loggedInUser?.user.admin ? '/groups/{group.id}' : undefined}>
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
</PageLayout>
