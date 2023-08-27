<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { UpdateGroupSchemaType } from './updateGroupSchema.js';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Input, Label, Button } from 'flowbite-svelte';

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

<div class="flex w-full flex-col items-center">
	<CenterCard title="Update Group {data.groupInfo.title}">
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
			<Label>
				<span class="my-2">Item Limit</span>
				<div class="flex flex-row justify-start gap-2 pt-2">
					<Button type="button" on:click={() => updateLimit(-1)}>-</Button>
					<Input
						type="number"
						id="limit"
						name="limit"
						bind:value={$form.limit}
						{...$constraints.limit}
					/>
					<Button type="button" on:click={() => updateLimit(1)}>+</Button>
				</div>
			</Label>
			<div class="flex w-full flex-row justify-between">
				<Button href="/groups">Cancel</Button>
				<Button type="submit">Update Group</Button>
			</div>
		</form>
		<form method="POST" action="?/delete" class="mt-2 flex w-full">
			<Button type="submit" color="red" outline class="w-full">Delete Group</Button>
		</form>
	</CenterCard>
</div>
