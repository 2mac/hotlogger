<script>
    import { page } from "$app/stores";
    import { logTypes } from "$lib/logtype";

    const log = $page.data.log;
    const logType = logTypes.find(t => t.id === log.type);
</script>

<div class="container-narrow">
    <h2>Logbook Settings</h2>

    <form method="POST" action="?/save">
        <div class="fields">
            <label for="name">Logbook Name</label>
            <input type="text" name="name" value={log.name} />
    
            <label for="type">Logbook Type</label>
            <div>
                {logType.name}
                <input type="hidden" name="type" value={log.type} />
            </div>
    
            <label for="callsign">Logbook Call Sign</label>
            <input type="text" name="callsign" value={log.callsign} />
    
            <label for="shared">Shared?</label>
            <input type="checkbox" name="shared" checked={log.shared} />
        </div>

        {#if logType.customFields}
            <h3>{logType.name} Settings</h3>

            <div class="fields">
                {#each logType.customFields as { key, label, type, required, placeholder }}
                    {#if type === 'address'}
                        <div class="label">Address</div>
                        <div>
                            <div><input type="text" name="addr:{key}:address" value={log.custom?.[key]?.address || ''} placeholder="123 Example St" /></div>
                            <div>
                                <input type="text" name="addr:{key}:city" value={log.custom?.[key]?.city || ''} placeholder="City" style="width:10em" {required} />
                                <input type="text" name="addr:{key}:state" value={log.custom?.[key]?.state || ''} placeholder="State" maxlength="2" style="width:2.5em" {required} />
                                <input type="text" name="addr:{key}:zip" value={log.custom?.[key]?.zip || ''} placeholder="ZIP Code" style="width:6em" {required} />
                                <br />
                                <input type="text" name="addr:{key}:country" value={log.custom?.[key]?.country || 'USA'} placeholder="Country" {required} />
                            </div>
                        </div>
                    {:else}
                        <label for={key}>{label}</label>

                        {#if type === 'checkbox'}
                            <input {type} name="c:{key}" checked={log.custom?.[key]} {required} />
                        {:else}
                            <input {type} name="c:{key}" value={log.custom?.[key] || ''} {required} {placeholder} />
                        {/if}
                    {/if}
                {/each}
            </div>
        {/if}

        <button>Save</button>
    </form>
    <form method="POST" action="?/delete">
        <button on:click={e => {
            (confirm('Really delete this logbook?') && 
                confirm('Are you really absolutely sure? This logbook and all its contacts will be permanently deleted!')) || 
            e.preventDefault();
        }}>Delete Logbook</button>
    </form>
</div>

<style>
    div.fields {
        display: grid;
        grid-template-columns: 1fr 2fr;
    }

    label, div.label {
        font-weight: bold;
        margin-left: auto;
        margin-right: 1em;
    }

    input {
        margin-right: auto;
    }

    button {
        margin: auto;
    }
</style>