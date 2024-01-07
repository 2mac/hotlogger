<script>

    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import Modal from "$lib/Modal.svelte";
    import { logTypes, fieldNames, getContactData } from "$lib/logtype";
    import { contacts } from "$lib/store";
    import { onMount } from "svelte";
    import { io } from 'socket.io-client';
    import OptionalInput from "./OptionalInput.svelte";
    import QuickInput from "./QuickInput.svelte";
    import dateFormat from 'dateformat';

    let myCall = $page.data.callsign
    let socket;
    let socketStatus = 'not connected';

    onMount(() => {
        document.title = $page.data.log.name;

        if ($page.data.log.shared) {
            socket = io({
                auth: { callsign: myCall },
                query: { log: $page.data.log.id }
            });

            socket.on('connect', () => {
                socketStatus = 'connected';
            });

            socket.on('disconnect', () => {
                socketStatus = 'not connected';
            });

            socket.on('create-contact', contact => {
                if (contact.op_call !== myCall) {
                    contacts.update(c => [contact, ...c]);
                }
            });

            socket.on('update-contact', contact => {
                contacts.update(c => {
                    const i = c.findIndex(c => c.id === contact.id);
                    if (i >= 0) c[i] = contact;
                    return c;
                });
            });

            socket.on('delete-contact', contact => {
                contacts.update(c => {
                    const i = c.findIndex(c => c.id === editContact.id);
                    if (i >= 0) c.splice(i, 1);
                    return c;
                });
            });
        }
    });

    const logType = logTypes[$page.data.log.type];
    const columns = logType.displayFields;
    const inputs = logType.inputs;
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

    let saving = false;
    let showEditModal = false;
    let editContact;
</script>

<a href="/log">Back</a>

{#if $page.data.log.shared}
Socket status: <span id="socket-status">{socketStatus}</span>
{/if}

<h2>{$page.data.log.name}</h2>

<div class="log-layout">
    <div class="contacts-table">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    
                    {#each columns as column}
                        <th>{fieldNames[column]}</th>
                    {/each}
                </tr>
            </thead>

            <tbody>
                {#each $contacts as contact, i}
                    <tr on:dblclick={e => {
                        editContact = contact;
                        showEditModal = true;
                    }}>
                        <td>{$contacts.length - i}</td>
                        
                        {#each columns as column}
                            {#if column === 'date'}
                                <td>{dateFormat(contact['time'], 'yyyy-mm-dd', true)}</td>
                            {:else if column === 'time'}
                                <td>{dateFormat(contact[column], 'HHMM', true)}</td>
                            {:else}
                                <td>{getContactData(contact, column)}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="inputs">
        <form method="POST" action="?/add" use:enhance={() => {
            saving = true;

            return async ({update, result}) => {
                await update();
                saving = false;
                document.getElementById('other_call').focus();

                const contact = result.data.contact;
                document.getElementById('freq_khz').value = contact.freq_khz;
                document.getElementById('mode').value = contact.mode;
                contacts.update(c => [result.data.contact, ...c]);
            };
        }}>
            <div>
                <label>
                    Call Sign:
                    <input type="text" id="other_call" name="other_call" style="width:10em" autocomplete="off" required 
                        on:input={e => {
                            const t = e.target;
                            t.value = t.value.toUpperCase();
                        }} />
                </label>

                <OptionalInput name="rst_sent" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="rst_recd" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="name" {inputs} />
                <OptionalInput name="qth" {inputs} />
                <OptionalInput name="c:skcc_nr" {inputs} />
                <OptionalInput name="memo" {inputs} width="50" />

                <button>Save Contact</button>
            </div>

            <div>
                <QuickInput id="freq_khz" name="freq_khz" label="Freq (kHz)" choices={bands} width="4" />
                <QuickInput id="mode" name="mode" label="Mode" choices={modes} width="4" restrict={logType.restrictModes} />
            </div>
        </form>
    </div>
</div>

<Modal bind:showModal={showEditModal}>
    <h3 slot="header">Edit contact</h3>

    <form method="POST" action="?/edit" use:enhance={({action}) => {
        return async ({update, result}) => {
            showEditModal = false;

            if (action.search === '?/edit') {
                contacts.update(c => {
                    const i = c.findIndex(c => c.id === editContact.id);
                    if (i >= 0) c[i] = result.data.contact;
                    return c;
                });
            } else { // delete
                contacts.update(c => {
                    const i = c.findIndex(c => c.id === editContact.id);
                    if (i >= 0) c.splice(i, 1);
                    return c;
                });
            }
        };
    }}>
        {#if editContact}
            <input type="hidden" name="id" value={editContact.id} />
            <table>
                {#each columns as column}
                    <tr>
                        <th>{fieldNames[column]}</th>
                        <td>
                            {#if column === 'other_call'}
                                <input type="text" name="other_call" autocomplete="off" required 
                                    value={editContact.other_call}
                                    on:input={e => {
                                        const t = e.target;
                                        t.value = t.value.toUpperCase();
                                    }} />
                            {:else if column === 'date'}
                                <input type="date" name="date" value={dateFormat(editContact['time'], 'yyyy-mm-dd', true)} required />
                            {:else if column === 'time'}
                                <input type="text" name="time" value={dateFormat(editContact[column], 'HHMM', true)} 
                                    pattern="[0-9]{'{'}2{'}'}:?[0-9]{'{'}2{'}'}" required />
                            {:else}
                                <input type="text" name={column} value={getContactData(editContact, column)} autocomplete="off" />
                            {/if}
                        </td>
                    </tr>
                {/each}
            </table>

            <button formaction="?/delete" on:click={e => {
                confirm('Really delete this contact?') || e.preventDefault();
            }}>Delete Contact</button>
            <button>Save Contact</button>
        {/if}
    </form>
</Modal>

<style>
    div.contacts-table {
        overflow-y: scroll;
        height: 50vh;
    }

    table {
        width: 100%;
        overflow-x: auto;
        border-collapse: collapse;
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