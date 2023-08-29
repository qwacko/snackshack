<script lang="ts">
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Alert, Button } from 'flowbite-svelte';
</script>

<div class="mt-6">
	<PageLayout size="xs" title="Error">
		<Alert color="red" class="mt-4 text-center">
			<p>Something went wrong.</p></Alert
		>
		<Button class="mt-4" href="/">Go Home</Button>
	</PageLayout>
</div>
