<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	export let data;

	$: if (data.user && browser) {
		goto('/home');
	} else if (browser) {
		goto('/login');
	}
</script>

Loading....
