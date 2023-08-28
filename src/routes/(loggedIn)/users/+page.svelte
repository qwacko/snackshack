<script lang="ts">
	import PageHeading from '$lib/components/PageHeading.svelte';
	import { Badge, Button, Card } from 'flowbite-svelte';

	export let data;
</script>

<div class="flex w-full flex-col justify-center gap-4">
	<PageHeading title="Users"><Button href="/users/create">Create User</Button></PageHeading>

	<div class="flex w-full grid-cols-6 justify-center">
		{#each data.users as currentUser}
			<Card href="/users/{currentUser.id}">
				<div class="bottom-1 flex flex-row items-center justify-center gap-4 p-2">
					<a href="/users/{currentUser.id}">{currentUser.username}</a>
					{#if currentUser.admin}
						<Badge>Admin</Badge>
					{/if}
					{#if currentUser.userOrderConfig}
						<Badge color="green">Orderer</Badge>
					{/if}
				</div>
			</Card>
		{/each}
	</div>
</div>
