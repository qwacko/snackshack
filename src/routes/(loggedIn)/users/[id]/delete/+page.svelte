<script lang="ts">
	import { enhance } from '$app/forms';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import { page } from '$app/stores';
	import PageLayout from '$lib/components/PageLayout.svelte';

	import { Button } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="User" subtitle="Delete User" size="xs">
	<div>
		Are you sure you want to delete user <b>{data.currentUser.username}</b>? This will also delete
		all of their orders.
	</div>
	<form method="POST" use:enhance>
		<div>
			<SpreadButtons>
				<Button type="submit">Delete {data.currentUser.username}</Button>
				<Button href="/users/{$page.params.id}" outline color="light">Cancel</Button>
			</SpreadButtons>
		</div>
	</form>
</PageLayout>
