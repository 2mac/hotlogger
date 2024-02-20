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

<div>
    <label for={name}>{label}:</label>
    {#if restrict}
        <select {id} {name} {required} bind:value={value} on:change>
            {#each Object.entries(choices) as [text, value]}
                <option {value}>{text}</option>
            {/each}
        </select>
    {:else}
        <TextSelect {id} {name} {choices} bind:value={value} on:change {required}/>
    {/if}
</div>

<style>
    div {
        display:flex;
        white-space: nowrap;
        flex-grow:1; 
    }
    label {
        display:flex; 
    }
    select {
        flex-grow:1
    }
</style>