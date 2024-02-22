<script>
  export let id;
  export let value;
  export let choices;

  export let name;
  export let placeholder;
  export let autocomplete;
  export let required;

  export let showChoices = false;

  let input;
</script>

<div>
  <div>
    <input
      {id}
      type="text"
      {name}
      {placeholder}
      {autocomplete}
      {required}
      on:change
      bind:value
      bind:this={input}
      on:focus={()=>{showChoices=true}}
    />
    {#if showChoices}
      <div style="view:lr; position:relative; transform: translate(0%,-5px)" on:focusout={()=>{showChoices=false}}>
        <ul>
          {#each Object.entries(choices) as [text, choice]}
            <li>
              <button
                type="button"
                on:click={() => {
                  value = choice;
                  input.value = choice;
                  input.focus();
                  input.dispatchEvent(new Event("change"));
                  showChoices = false;
                }}>{text}</button
              >
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  input {
    flex-grow: 1;
  }

  div {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  ul {
    position: fixed;
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
