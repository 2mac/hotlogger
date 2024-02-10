<script>
    export let id; 
    export let value;
    export let choices;

    export let name;
    export let placeholder;
    export let autocomplete;
    export let required;

    let input;
    let showChoices = false;
</script>
<div on:focusin={()=>{showChoices=true}} on:focusout={()=>{showChoices=false}}>
    <div style="display:flex; flex-direction:column;">
        <input id={id} type="text" {name} {placeholder} {autocomplete} {required} on:change
        bind:value={value}
        bind:this={input}/>
        <div>
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
    </div>

</div>
</div>




<style>
    div {
        display: inline-block;
    }
    
    ul {
        position: absolute;
        z-index: 99;
        border: thin solid;
        width: fit-content;
        margin: 5px;
        padding: 5px;
        background-color: white;
    }
    
    li {
        list-style: none;
        z-index: 99;
        cursor: pointer;
    }
</style>