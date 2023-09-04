<script lang="ts">
	import { page } from '$app/stores';
	import BackupIcon from '$lib/components/icons/BackupIcon.svelte';
	import HomeIcon from '$lib/components/icons/HomeIcon.svelte';
	import LogoutIcon from '$lib/components/icons/LogoutIcon.svelte';
	import SnackGroupIcon from '$lib/components/icons/SnackGroupIcon.svelte';
	import SnacksIcon from '$lib/components/icons/SnacksIcon.svelte';
	import UserIcon from '$lib/components/icons/UserIcon.svelte';
	import UsersIcon from '$lib/components/icons/UsersIcon.svelte';
	import WeeksIcon from '$lib/components/icons/WeeksIcon.svelte';
	import { Button, Tooltip } from 'flowbite-svelte';

	export let data;

	$: activeUrl = $page.url.pathname;

	$: userId = data.loggedInUser?.userId;
	$: userIsAdmin = data.loggedInUser?.admin;

	$: userPage = activeUrl.startsWith('/users') && activeUrl === `/users/${userId}`;
	$: usersPage = activeUrl.startsWith('/users') && !userPage;
	$: snacksPage = activeUrl.startsWith('/snacks');
	$: groupsPage = activeUrl.startsWith('/groups');
	$: periodsPage = activeUrl.startsWith('/orderingPeriods');
	$: homePage = activeUrl === '/home';
	$: backupPage = activeUrl === '/backup';
	$: logoutPage = activeUrl === '/signout';
</script>

<div class="flex w-full flex-col items-center">
	<div class="flex w-full max-w-5xl flex-col gap-2">
		<div class="m-x-10 m-y-4 flex w-full flex-row items-center justify-center gap-2 p-4">
			<div class="flex flex-grow basis-0">
				<img src="/completelogo.svg" alt="SnackShack Logo" class="h-" />
			</div>

			<Button id="homeLink" href="/home" color={homePage ? 'primary' : 'none'} class="p-3">
				<HomeIcon />
				<Tooltip triggeredBy="[id=homeLink]" type="light">Home</Tooltip>
			</Button>
			{#if userIsAdmin}
				<Button id="usersLink" href="/users" color={usersPage ? 'primary' : 'none'} class="p-3">
					<UsersIcon />
					<Tooltip triggeredBy="[id=usersLink]" type="light">Users</Tooltip>
				</Button>
				<Button
					id="weeksLink"
					href="/orderingPeriods"
					color={periodsPage ? 'primary' : 'none'}
					class="p-3"
				>
					<WeeksIcon />
					<Tooltip triggeredBy="[id=weeksLink]" type="light"
						>{data.orderingTexts.periodsTitle}</Tooltip
					>
				</Button>

				<Button id="snacksLink" href="/snacks" color={snacksPage ? 'primary' : 'none'} class="p-3">
					<SnacksIcon />
					<Tooltip triggeredBy="[id=snacksLink]" type="light">Snacks</Tooltip>
				</Button>
				<Button id="groupsLink" href="/groups" color={groupsPage ? 'primary' : 'none'} class="p-3">
					<SnackGroupIcon />
					<Tooltip triggeredBy="[id=groupsLink]" type="light">Groups</Tooltip>
				</Button>
				<Button id="backupLink" href="/backup" color={backupPage ? 'primary' : 'none'} class="p-3">
					<BackupIcon />
					<Tooltip triggeredBy="[id=backupLink]" type="light">Backups</Tooltip>
				</Button>
			{/if}
			<div class="flex flex-grow basis-0 flex-row items-center justify-end gap-2">
				<Button
					id="userLink"
					href="/users/{userId}"
					color={userPage ? 'primary' : 'none'}
					class="p-3"
				>
					<div class="flex=row flex items-center gap-1">
						<UserIcon />
						<div class="flex">{data.loggedInUser?.name}</div>
						<Tooltip triggeredBy="[id=userLink]" type="light">Current User</Tooltip>
					</div>
				</Button>
				<Button id="logoutLink" href="/signout" color={logoutPage ? 'primary' : 'none'} class="p-3">
					<LogoutIcon />
					<Tooltip triggeredBy="[id=logoutLink]" type="light">Logout</Tooltip>
				</Button>
			</div>
		</div>
		<div class="flex">
			<slot />
		</div>
	</div>
</div>
