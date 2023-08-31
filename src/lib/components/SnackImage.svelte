<script lang="ts">
	export let imageFilename: string | null | undefined;
	export let snackTitle: string | null;
</script>

{#if imageFilename}
	<div class="flex h-32 w-32">
		<img
			src={`/snacks/images/${imageFilename}`}
			class="max-w-32 flex max-h-32 {$$props.class}"
			alt="{snackTitle} Image"
		/>
	</div>
{:else}
	<div class="flex h-32 w-32 content-center items-center justify-center {$$props.class}">
		No Image
	</div>
{/if}
