<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import PageLayout from '$lib/components/PageLayout.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { UpdateUserOrderingConfigSchemaType } from '$lib/schema/userOrderingConfigSchema.js';
	import { Button, Hr } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { enhance } from '$app/forms';

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
</script>

<PageLayout title="User" subtitle={data.user?.username || undefined} size="sm">
	{#if data.user}
		<Card class="flex w-full flex-col justify-center gap-2">
			<h5 class="flex text-lg font-bold">Actions</h5>
			<div class="flex flex-row gap-2">
				{#if data.user?.admin && data.user.userId !== data.currentUser.id}
					{#if !data.currentUser.admin}
						<form action="?/setAdmin" method="POST" use:enhance>
							<Button type="submit">Set Admin</Button>
						</form>
					{:else}
						<form action="?/removeAdmin" method="POST" use:enhance>
							<Button type="submit">Remove Admin</Button>
						</form>
					{/if}
				{/if}
				{#if data.user.admin || data.user.userId === data.currentUser.id}
					<Button href="/users/{data.currentUser.id}/password">Edit Password</Button>
				{/if}

				{#if data.user?.admin && data.user.userId !== data.currentUser.id}
					<Button href="/users/{data.currentUser.id}/delete" style="secondary" color="red" outline>
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

	{#if data.currentUser.userOrderConfig?.enabled}
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
	<Button href="/users" outline color="light">Cancel</Button>
</PageLayout>
