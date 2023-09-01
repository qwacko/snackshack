<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { UpdateUserOrderingConfigSchemaType } from '$lib/schema/userOrderingConfigSchema.js';
	import { Button, Hr } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { enhance } from '$app/forms';
	import type { updateNameSchemaType } from '$lib/schema/updatePasswordSchema copy.js';

	export let data;

	const {
		enhance: updateEnhance,
		message,
		form,
		errors,
		constraints
	} = superForm<UpdateUserOrderingConfigSchemaType>(data.form, {
		taintedMessage: false
	});

	const {
		enhance: nameEnhance,
		message: nameMessage,
		form: nameForm,
		errors: nameErrors,
		constraints: nameConstraints
	} = superForm<updateNameSchemaType>(data.usernameForm, { taintedMessage: false });

	$: userIsAdmin = data.user?.admin;
	$: userIsCurrentUser = data.user?.userId === data.currentUser.id;
	$: showSetAdmin = userIsAdmin && !userIsCurrentUser && !data.currentUser.admin;
	$: showRemoveAdmin = userIsAdmin && !userIsCurrentUser && data.currentUser.admin;
	$: showUpdatePassword = userIsAdmin || userIsCurrentUser;
	$: showDelete = userIsAdmin && !userIsCurrentUser;
	$: showActions = showSetAdmin || showRemoveAdmin || showUpdatePassword || showDelete;
</script>

<PageLayout title="User" subtitle={data.currentUser?.name || undefined} size="sm">
	{#if data.user}
		<Card class="flex w-full flex-col gap-2">
			<h5 class="flex text-lg font-bold">Details</h5>
			<h5 class="text-md flex flex-row gap-1">Username : <b>{data.currentUser.username}</b></h5>
			{#if userIsAdmin}
				<form
					action="?/updateName"
					method="POST"
					use:nameEnhance
					class="flex w-full flex-row items-end gap-2"
				>
					<div class="flex flex-grow">
						<TextInput
							wrapperClass="flex grow"
							type="text"
							id="name"
							title="Name"
							name="name"
							bind:value={$nameForm.name}
							errorMessage={$nameErrors.name}
							data-invalid={$nameErrors.name}
							{...$nameConstraints.name}
						/>
					</div>
					<Button type="submit">Update Name</Button>
				</form>
			{:else}
				<h5 class="text-md flex flex-row gap-1">Name : <b>{data.currentUser.name}</b></h5>
				{#if data.currentUser.userOrderConfig?.enabled}
					<h5 class="text-md flex flex-row gap-1">
						Weekly Spend : <b>${(data.currentUser.userOrderConfig.amount / 100.0).toFixed(2)}</b>
					</h5>
				{/if}
			{/if}
		</Card>
		{#if showActions}
			<Card class="flex w-full flex-col justify-center gap-2">
				<h5 class="flex text-lg font-bold">Actions</h5>
				<div class="flex flex-row gap-2">
					{#if showSetAdmin}
						<form action="?/setAdmin" method="POST" use:enhance>
							<Button type="submit">Set Admin</Button>
						</form>
						{#if showRemoveAdmin}
							<form action="?/removeAdmin" method="POST" use:enhance>
								<Button type="submit">Remove Admin</Button>
							</form>
						{/if}
					{/if}
					{#if showUpdatePassword}
						<Button href="/users/{data.currentUser.id}/password">Update Password</Button>
					{/if}

					{#if showDelete}
						<Button
							href="/users/{data.currentUser.id}/delete"
							style="secondary"
							color="red"
							outline
						>
							Delete User
						</Button>
					{/if}

					{#if data.user.admin && (!data.currentUser.userOrderConfig || !data.currentUser.userOrderConfig.enabled)}
						<form action="?/addOrderConfig" method="POST" use:enhance>
							<Button type="submit">Allow Ordering</Button>
						</form>
					{/if}
				</div>
			</Card>
		{/if}
	{/if}

	{#if data.currentUser.userOrderConfig?.enabled}
		{#if userIsAdmin}
			<Card class="flex w-full flex-col gap-2">
				<h5 class="flex text-lg font-bold">Order Configs</h5>
				<form
					action="?/updateOrderingConfig"
					method="POST"
					use:updateEnhance
					class="flex w-full flex-row items-end gap-2"
				>
					<input type="hidden" name="enabled" value="true" />
					<div class="flex flex-grow">
						<NumberInput
							wrapperClass="flex grow"
							type="number"
							id="amount"
							title="Amount (Cents) - ${(($form.amount || 0) / 100.0).toFixed(2)}"
							name="amount"
							bind:value={$form.amount}
							errorMessage={$errors.amount}
							data-invalid={$errors.amount}
							{...$constraints.amount}
						/>
					</div>
					<Button type="submit">Update</Button>
				</form>
				<form action="?/disableOrderConfig" method="POST" use:enhance>
					<Button type="submit" class="flex w-full" outline color="light">Disable Ordering</Button>
				</form>
			</Card>
		{/if}
	{/if}
	{#if data.loggedInUser?.admin}
		<Button href="/users" outline color="light">Back</Button>{:else}
		<Button href="/home" outline color="light">Back</Button>{/if}
</PageLayout>
