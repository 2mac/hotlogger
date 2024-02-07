<script>
    export let value;
    export let choices;

    export let name;
    export let placeholder;
    export let autocomplete;
    export let required;

    let input;
    let showChoices = false;
</script>

<div>
    <input type="text" {name} {placeholder} {autocomplete} {required} on:change
        bind:value={value}
        bind:this={input}
        on:click={() => { showChoices = true; }} />
</div>

{#if showChoices}
    <ul>
        {#each Object.entries(choices) as [text, choice]}
            <li>
                <button type="button" on:click={() => {
                    value = choice;
                    input.value = choice;
                    input.focus();
                    input.dispatchEvent(new Event('change'));
                    showChoices = false;
                    }} >{text}</button>
            </li>
        {/each}
    </ul>
{/if}

<style>
    div {
        position: relative;
        display: inline-block;
    }
    
    ul {
        position: relative;
        top: 0;
        z-index: 99;
        border: thin solid;
        width: fit-content;
        margin: 5px;
        padding: 5px;
    }
    
    li {
        list-style: none;
        z-index: 99;
        cursor: pointer;
    }
</style>