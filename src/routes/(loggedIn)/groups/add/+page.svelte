<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { AddGroupSchemaType } from '$lib/schema/addGroupSchema';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Button } from 'flowbite-svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';

	export let data;

	const { form, errors, constraints, message, enhance } = superForm<AddGroupSchemaType>(
		data.addForm,
		{ taintedMessage: null }
	);
</script>

<PageLayout title="Add Group" size="xs">
	<form method="POST" action="?/add" class=" flex w-full flex-col gap-4" use:enhance>
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

		<Button type="submit">Add Group</Button>
	</form>
</PageLayout>
