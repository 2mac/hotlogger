<script>
    import { page } from "$app/stores";
    import TextSelect from "$lib/TextSelect.svelte";

    export let id;
    export let name;
    export let value = $page.data[name] || '';
    export let label;
    export let choices;
    export let restrict = false;
    export let required = false;
</script>

<span>
    <label for={name}>{label}:</label>
    {#if restrict}
        <select {id} {name} {required} bind:value={value} on:change>
            {#each Object.entries(choices) as [text, value]}
                <option {value}>{text}</option>
            {/each}
        </select>
    {:else}
        <TextSelect {id} {name} {choices} bind:value={value} on:change {required} />
    {/if}
</span>

<style>
    span {
        max-width: 100%;
        margin: 0.5em 0.5em 0.5em 0;
        white-space: nowrap;
    }
</style>