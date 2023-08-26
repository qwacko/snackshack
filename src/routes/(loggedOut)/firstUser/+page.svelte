<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { signupSchemaType } from '$lib/schema/signupSchema.js';

	export let data;
	const { form, errors, constraints, message, enhance } = superForm<signupSchemaType>(data.form, {
		taintedMessage: null
	});
</script>

<CenterCard title="Create Admin User">
	<form method="POST" class="flex flex-col space-y-4" autocomplete="off" use:enhance>
		<TextInput
			title="Username"
			errorMessage={$errors.username}
			id="username"
			name="username"
			type="text"
			data-invalid={$errors.username}
			bind:value={$form.username}
			{...$constraints.username}
		/>
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
		<Button type="submit" class="w-full">Create First Admin User</Button>
	</form>
</CenterCard>
