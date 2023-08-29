<script lang="ts">
	import { enhance } from '$app/forms';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Button, Input } from 'flowbite-svelte';

	export let data;

	let pageNo = 1;
	let perPage = 10;

	$: displayFiles = data.backupFiles.slice((pageNo - 1) * perPage, pageNo * perPage);
	$: numberPages = Math.ceil(data.backupFiles.length / perPage);
</script>

<PageLayout title="Backups" size="lg">
	<div class="flex flex-row">
		<div class="flex flex-grow" />
		<div class="flex flex-col gap-2">
			{#each displayFiles as backup}
				<div class="flex flex-row items-center gap-2">
					<form action="?/restore" method="post" class="flex" use:enhance>
						<input type="hidden" name="backupName" value={backup} />
						<Button type="submit">Restore</Button>
					</form>
					<form action="?/delete" method="post" class="flex" use:enhance>
						<input type="hidden" name="backupName" value={backup} />
						<Button type="submit" color="red" outline>Delete</Button>
					</form>
					<div class="flex grow flex-row">{backup}</div>
				</div>
			{/each}
		</div>
		<div class="flex grow" />
	</div>
	<div class="flex self-center">
		{#if pageNo > 1}
			<Button
				on:click={() => {
					if (pageNo > 1) pageNo--;
				}}
			>
				Previous
			</Button>
		{/if}
		<div>Page {pageNo} of {numberPages}</div>
		{#if pageNo < numberPages}
			<Button
				on:click={() => {
					if (pageNo < numberPages) pageNo++;
				}}
			>
				Next
			</Button>
		{/if}
	</div>
	<div class="flex self-stretch">
		<form
			action="?/backup"
			method="post"
			use:enhance
			class="flex w-full flex-row justify-center gap-2"
		>
			<Input
				type="text"
				name="backupName"
				placeholder="Backup Name"
				class="flex max-w-sm flex-grow"
			/>
			<Button type="submit">Create New Backup</Button>
		</form>
	</div>
</PageLayout>
