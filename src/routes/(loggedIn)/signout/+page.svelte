<script lang="ts">
	import { enhance } from '$app/forms';
	import Center from '$lib/components/Center.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Heading, Button } from 'flowbite-svelte';
</script>

<PageLayout title="Sign Out">
	<form method="POST" use:enhance class="mt-4 flex w-full items-center justify-center">
		<Button type="submit">Sign Out</Button>
	</form>
</PageLayout>
