<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';
	import { Alert, Badge, Button, Card } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Groups" size="lg">
	{#if data.loggedInUser?.admin}
		<Button href="/groups/add" outline class="self-center">Add</Button>
	{/if}
	{#if data.groups.length > 0}
		<SnackArrangement>
			{#each data.groups as group}
				<Card href={data.loggedInUser?.admin ? `/groups/${group.id}` : undefined}>
					<div class="flex flex-col items-center justify-center gap-2">
						<h2>{group.title}</h2>
						{#if group.limit && group.limit > 0}
							<Badge>Limit {group.limit}</Badge>
						{/if}
					</div>
				</Card>
			{/each}
		</SnackArrangement>
	{:else}
		<Alert class="w-max-48 text-center" color="red">No groups found</Alert>
	{/if}
</PageLayout>
