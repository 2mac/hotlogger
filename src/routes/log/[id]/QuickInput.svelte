<script>
    import { page } from "$app/stores";

    export let id;
    export let name;
    export let value = $page.data[name];
    export let label;
    export let choices;
    export let width = 10;
    export let restrict = false;
</script>

<span>
    <label for={name}>{label}:</label>
    {#if restrict}
        <select {id} {name}>
            {#each Object.entries(choices) as [text, value]}
                <option {value}>{text}</option>
            {/each}
        </select>
    {:else}
        <input type="text" {id} {name} value={value || ''} style="width:{width}em" autocomplete="off" />

        {#each Object.entries(choices) as [text, value]}
            <button type="button" on:click={() => {
                let input = document.getElementsByName(name);
                input[0].value = value;
            }}>{text}</button>
        {/each}
    {/if}
</span>

<style>
    span {
        max-width: 100%;
        margin: 0.5em 0.5em 0.5em 0;
        white-space: nowrap;
    }
</style>