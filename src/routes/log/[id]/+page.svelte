<script>

    import { page } from "$app/stores";
    import { logTypes, standardFields } from "$lib/logtype";
    import { contacts } from "$lib/store";
    import OptionalInput from "./OptionalInput.svelte";
    import QuickInput from "./QuickInput.svelte";
    import dateFormat from 'dateformat';

    const columns = logTypes[$page.data.log.type].displayFields;
    const inputs = logTypes[$page.data.log.type].inputs;
    contacts.set($page.data.contacts);

    const bands = {
        '6m': 50000,
        '10m': 28000,
        '12m': 24890,
        '15m': 21000,
        '17m': 18068,
        '20m': 14000,
        '30m': 10100,
        '40m': 7000,
        '80m': 3500,
        '160m': 1800
    };

    let modes = {};
    logTypes[$page.data.log.type].modes.forEach((mode) => modes[mode] = mode);
</script>

<a href="/log">Back</a>

<h2>{$page.data.log.name}</h2>

<div class="log-layout">
    <div class="contacts-table">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    
                    {#each columns as column}
                        <th>{standardFields[column]}</th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#each $contacts as contact, i}
                    <tr>
                        <td>{$contacts.length - i}</td>
                        
                        {#each columns as column}
                            {#if column === 'date'}
                                <td>{dateFormat(contact['time'], 'yyyy-mm-dd', true)}</td>
                            {:else if column === 'time'}
                                <td>{dateFormat(contact[column], 'HHMM', true)}</td>
                            {:else}
                                <td>{contact[column]}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="inputs">
        <form method="POST" action="?/add">
            <div>
                <label>
                    Call Sign:
                    <input type="text" name="other_call" style="width:10em" required 
                        on:input={e => {
                            const t = e.target;
                            t.value = t.value.toUpperCase();
                        }} />
                </label>

                <OptionalInput name="rst_sent" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="rst_recd" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="name" {inputs} />
                <OptionalInput name="qth" {inputs} />
                <OptionalInput name="memo" {inputs} width="50" />

                <button>Save Contact</button>
            </div>

            <div>
                <QuickInput name="freq_khz" label="Freq (kHz)" choices={bands} width="4" />
                <QuickInput name="mode" label="Mode" choices={modes} width="4" />
            </div>
        </form>
    </div>
</div>

<style>
    div.contacts-table {
        height: 50vh;
    }

    table {
        width: 100%;
        overflow-x: auto;
        border-collapse: collapse;
    }

    tbody {
        overflow-y: scroll;
    }

    th {
        border: thin solid;
    }

    td {
        border: thin dotted;
    }

    form label {
        margin-right: 0.5em;
    }
</style>