<script lang="ts">
	import { page } from '$app/stores';
	import { Dropdown, DropdownItem, Heading } from 'flowbite-svelte';
	import MenuIcon from '~icons/mdi/menu';

	$: activeUrl = $page.url.pathname;
</script>

<div class="flex flex-col gap-2">
	<div class="m-x-10 m-y-4 flex w-full flex-row items-center justify-center gap-10 p-4">
		<Heading level="h1" class="text-2xl font-bold">Snack Shack</Heading>
		<div class="flex flex-grow" />
		<MenuIcon class="dots-menu" />
		<Dropdown triggeredBy=".dots-menu" {activeUrl}>
			<DropdownItem href="/users" activeClass="font-bold">Users</DropdownItem>
			<DropdownItem slot="footer" href="/signout">Sign out</DropdownItem>
		</Dropdown>
	</div>

	<div class="flex">
		<slot />
	</div>
</div>
