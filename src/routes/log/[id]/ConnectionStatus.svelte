<script>
    /**
     * @type string
     * {string="connected", "not-connected", ?}
     */
    export let connectionStatus = "";
    export let size = 15; 
    export let explicit = false; 
</script>

<div style="    --size: {size}px;
display: flex;
align-items: center;
column-gap: 2px;">
    Socket status: 
    {#if connectionStatus == "connected"}
    <span style="background-color: green"></span>
    {:else if connectionStatus == "not-connected"}
    <span style="background-color: red"></span>
    {:else}
    <span></span>
    {/if}
    {#if explicit}
    {connectionStatus}
    {/if}
</div>

<style>
    span {
        aspect-ratio: 1; 
        height: var(--size);
        background-color: #bbb;
        border-radius: 50%;
        display: inline-block;
    }
</style>