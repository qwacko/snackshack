<script lang="ts">
	export let imageFilename: string | null | undefined;
	export let snackTitle: string | null;
</script>

{#if imageFilename}
	<img
		src={`/snacks/images/${imageFilename}`}
		class="max-w-32 flex max-h-32 {$$props.class}"
		alt="{snackTitle} Image"
	/>
{/if}
