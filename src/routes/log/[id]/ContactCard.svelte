<script>
   export let contact;
</script>

<div style="    display: flex;
flex-direction: column;
align-items: center;
border: solid;
border-color: black;
border-width: thin;
border-radius: 4px;
min-width: 260px;">
<table>
    {#each Object.keys(contact) as key}
    <tr>
        <td>{key}</td>
        <td>{contact[key]}</td>
    </tr>
    {/each}
</table>
</div>

<style>

</style>