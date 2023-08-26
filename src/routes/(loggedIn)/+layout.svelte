<script lang="ts">
	import { page } from '$app/stores';

	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	$: activeUrl = $page.url.pathname;
</script>

<div class="p-4">
	<Sidebar {activeUrl}>
		<SidebarWrapper>
			<SidebarGroup>
				<SidebarItem label="Users" href="/users" />
				<SidebarItem label="User" href="/user" />
			</SidebarGroup></SidebarWrapper
		>
	</Sidebar>
	<slot />
</div>
