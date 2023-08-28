<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { UpdateSnackSchemaType } from '$lib/schema/updateSnackSchema.js';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { Input, Label, Button, Select } from 'flowbite-svelte';
	import SelectInput from '$lib/components/SelectInput.svelte';
	import RangeInput from '$lib/components/RangeInput.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import CheckboxInput from '$lib/components/CheckboxInput.svelte';

	export let data;

	const { form, errors, constraints, message, enhance, fields } = superForm<UpdateSnackSchemaType>(
		data.form,
		{ taintedMessage: null }
	);
</script>

<div class="flex w-full flex-col items-center">
	<CenterCard title="Update Snack {data.snack.title}">
		<form method="POST" class=" flex w-full flex-col gap-4" use:enhance>
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
			<RangeInput
				id="maxQuantity"
				title="Max Quantity - {$form.maxQuantity ? $form.maxQuantity : 'Any'}"
				errorMessage={$errors.maxQuantity}
				min="0"
				max="10"
				step="1"
				name="maxQuantity"
				initialValue={1}
				initialValueText="Enable Limit"
				data-invalid={$errors.maxQuantity}
				bind:value={$form.maxQuantity}
				{...$constraints.maxQuantity}
			/>
			<CheckboxInput
				title="Override Group Quantity Limit"
				message="Overridden"
				errorMessage={$errors.overrideGroupLimit}
				name="overrideGroupLimit"
				bind:value={$form.overrideGroupLimit}
				{...$constraints.overrideGroupLimit}
			/>
			<NumberInput
				type="number"
				id="priceCents"
				title="Price (cents) - ${($form.priceCents / 100.0).toFixed(2)}"
				errorMessage={$errors.priceCents}
				name="priceCents"
				data-invalid={$errors.maxQuantity}
				bind:value={$form.priceCents}
				{...$constraints.priceCents}
			/>
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
			<NumberInput
				type="number"
				id="salePrice"
				title="Sale Price (cents) - ${$form.salePrice / 100.0}"
				errorMessage={$errors.salePrice}
				name="salePrice"
				data-invalid={$errors.salePrice}
				bind:value={$form.salePrice}
				{...$constraints.salePrice}
			/>
			<RangeInput
				id="availablePercentage"
				title="Available Percentage - {$form.availablePercentage}%"
				errorMessage={$errors.availablePercentage}
				min="0"
				max="100"
				step="5"
				name="availablePercentage"
				data-invalid={$errors.availablePercentage}
				bind:value={$form.availablePercentage}
				{...$constraints.availablePercentage}
			/>

			<CheckboxInput
				title="Enabled"
				message="Enabled"
				errorMessage={$errors.enabled}
				name="enabled"
				bind:value={$form.enabled}
				{...$constraints.enabled}
			/>
			<Button type="submit">Update Snack</Button>
			<Button href="/snacks" outline>Cancel</Button>
		</form>
	</CenterCard>
</div>
