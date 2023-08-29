<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { UpdateGroupSchemaType } from '$lib/schema/updateGroupSchema.js';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Input, Label, Button } from 'flowbite-svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';

	export let data;

	const { form, errors, constraints, message, enhance, fields } = superForm<UpdateGroupSchemaType>(
		data.form,
		{ taintedMessage: null }
	);

	const updateLimit = (change: number) => {
		let newLimit = $form.limit;

		if (newLimit === undefined || newLimit === null) {
			newLimit = 0;
		}

		newLimit += change;

		if (newLimit < 0) {
			newLimit = 0;
		}

		$form = {
			...$form,
			limit: newLimit
		};
	};
</script>

<PageLayout title="Update Group" subtitle={data.groupInfo.title} size="xs">
	<form method="POST" action="?/update" class=" flex w-full flex-col gap-4" use:enhance>
		<TextInput
			title="Title"
			errorMessage={$errors.title}
			id="title"
			name="title"
			type="text"
			data-invalid={$errors.title}
			bind:value={$form.title}
			{...$constraints.title}
		/>
		<RangeInput
			title="Max Quantity - {$form.limit ? $form.limit : 'Any'}"
			errorMessage={$errors.limit}
			min="0"
			max="10"
			step="1"
			name="limit"
			initialValue={0}
			initialValueText="No Limit"
			data-invalid={$errors.limit}
			bind:value={$form.limit}
			{...$constraints.limit}
		/>
		<div class="flex w-full flex-row justify-between gap-4">
			<Button class="flex flex-grow" type="submit">Update Group</Button>
			<Button class="flex flex-grow" href="/groups" outline color="light">Cancel</Button>
		</div>
	</form>
	<form method="POST" action="?/delete" class="mt-2 flex w-full">
		<Button type="submit" color="red" outline class="w-full">Delete Group</Button>
	</form>
</PageLayout>
