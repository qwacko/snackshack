<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { AddSnackSchemaType } from './addSnackSchema.js';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Input, Label, Button, Select } from 'flowbite-svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';

	export let data;

	const { form, errors, constraints, message, enhance, fields } = superForm<AddSnackSchemaType>(
		data.addForm,
		{ taintedMessage: null }
	);

	const updateLimit = (change: number) => {
		let newLimit = $form.maxQuantity;

		if (newLimit === undefined || newLimit === null) {
			newLimit = 0;
		}

		newLimit += change;

		if (newLimit < 0) {
			newLimit = 0;
		}

		$form = {
			...$form,
			maxQuantity: newLimit
		};
	};
</script>

<div class="flex w-full flex-col items-center">
	<CenterCard title="Add Snack">
		<form method="POST" action="?/add" class=" flex w-full flex-col gap-4" use:enhance>
			<TextInput
				id="title"
				title="Title"
				errorMessage={$errors.title}
				name="title"
				type="text"
				data-invalid={$errors.title}
				bind:value={$form.title}
				{...$constraints.title}
			/>
			<SelectInput
				id="snackGroupId"
				title="Snack Group"
				errorMessage={$errors.snackGroupId}
				name="snackGroupId"
				data-invalid={$errors.snackGroupId}
				bind:value={$form.snackGroupId}
				items={data.snackGroups.map((group) => ({ value: group.id, name: group.title }))}
				{...$constraints.snackGroupId}
			/>
			<Label>
				<span class="my-2">Item Limit</span>
				<div class="flex flex-row justify-start gap-2 pt-2">
					<Button type="button" on:click={() => updateLimit(-1)}>-</Button>
					<Input
						type="number"
						id="limit"
						name="limit"
						bind:value={$form.maxQuantity}
						{...$constraints.maxQuantity}
					/>
					<Button type="button" on:click={() => updateLimit(1)}>+</Button>
				</div>
			</Label>
			<RangeInput
				id="salePercentage"
				title="Sale Percentage - {$form.salePercentage}%"
				errorMessage={$errors.salePercentage}
				min="0"
				max="100"
				step="5"
				name="salePercentage"
				data-invalid={$errors.salePercentage}
				bind:value={$form.salePercentage}
				{...$constraints.salePercentage}
			/>
			<Button type="submit">Add Snack</Button>
			<Button href="/snacks" outline>Cancel</Button>
		</form>
	</CenterCard>
</div>
