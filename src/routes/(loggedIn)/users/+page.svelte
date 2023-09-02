<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import SnackArrangement from '$lib/components/SnackArrangement.svelte';
	import { Badge, Button, Card } from 'flowbite-svelte';

	export let data;

	$: userIsAdmin = data.user?.admin;
</script>

<PageLayout title="Users" size="lg">
	{#if userIsAdmin}
		<Button class="self-center" href="/users/create" outline>Create User</Button>
	{/if}
	<SnackArrangement>
		{#each data.users as currentUser}
			<Card href="/users/{currentUser.id}">
				<div class="flex flex-col items-center gap-2">
					<a class="flex" href="/users/{currentUser.id}">{currentUser.name}</a>
					<div class="bottom-1 flex flex-row items-center justify-center gap-4 p-2">
						{#if currentUser.admin}
							<Badge>Admin</Badge>
						{/if}
						{#if currentUser.userOrderConfig?.enabled}
							<Badge color="green">Orderer</Badge>
							<Badge color="green"
								>${(currentUser.userOrderConfig.amount / 100.0).toFixed(2)}
							</Badge>
						{/if}
					</div>
				</div>
			</Card>
		{/each}
	</SnackArrangement>
</PageLayout>
