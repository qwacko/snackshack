<script lang="ts">
	import { enhance } from '$app/forms';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;
</script>

<PageLayout title="Recreate Week">
	<div class="flex flex-col items-center gap-4">
		<div class="flex">
			{data.startDate.toISOString().slice(0, 10)} to {data.endDate.toISOString().slice(0, 10)}
		</div>
		<div class="flex">
			Are you sure you want to reset this week. This will remove {data.orderCount} order lines, and {data.optionCount}
			options.
		</div>
		<div class="flex self-center">
			<form action="?/recreateWeek" method="POST" use:enhance>
				<Button type="submit" outline>Re-Create Week</Button>
			</form>
		</div>
	</div>
</PageLayout>
