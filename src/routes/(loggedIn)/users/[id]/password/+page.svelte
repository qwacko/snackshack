<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { passwordSchemaType } from './+page.server.js';
	import TextInput from '$lib/components/TextInput.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';

	import { page } from '$app/stores';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import { Button } from 'flowbite-svelte';

	export let data;

	const { form, errors, constraints, message, enhance, allErrors } = superForm<passwordSchemaType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<PageLayout title="User" subtitle="Change Password" size="sm">
	<form method="POST" use:enhance class="flex flex-col gap-4">
		<TextInput
			title="Password"
			errorMessage={$errors.password}
			type="password"
			id="password"
			name="password"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>
		<TextInput
			title="Confirm Password"
			errorMessage={$errors.confirmPassword}
			type="password"
			id="confirmPassword"
			name="confirmPassword"
			data-invalid={$errors.confirmPassword}
			bind:value={$form.confirmPassword}
			{...$constraints.confirmPassword}
		/>

		<ErrorText message={$message} />
		<SpreadButtons>
			<Button type="submit">Update</Button>
			<Button href="/users/{$page.params.id}" colour="light" outline>Cancel</Button>
		</SpreadButtons>
	</form>
</PageLayout>
