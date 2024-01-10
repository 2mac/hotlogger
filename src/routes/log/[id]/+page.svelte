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
    import { bandChoices, bandToFreq, commonBands, freqToBand } from "$lib/bands";
    import { get } from "svelte/store";

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
    const inputs = logType.inputs;
    contacts.set($page.data.contacts);

    let columns = logType.displayFields;
    if ($page.data.log.shared)
        columns = [...columns, 'op_call'];

    const bands = bandChoices(logType.bands || commonBands);

    let modes = {};
    logType.modes.forEach((mode) => modes[mode] = mode);

    let showEditModal = false;
    let duplicateText = '&nbsp;';
    let editContact;

    let otherCall = '';
    let freqKhz;
    let mode;

    $: otherCall = otherCall.toUpperCase();
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
                            {:else if column === 'band'}
                                <td>{freqToBand(contact['freq_khz'])}</td>
                            {:else}
                                <td>{getContactData(contact, column)}</td>
                            {/if}
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    {#if logType.preventDuplicates}
        <p style="color:red">{@html duplicateText}</p>
    {/if}

    <div class="inputs">
        <form method="POST" id="new-contact-form" action="?/add" use:enhance={({cancel}) => {
            if (logType.preventDuplicates === true) {
                const dupe = get(contacts).find(c => c.other_call === otherCall && freqToBand(c.freq_khz) === freqToBand(freqKhz) && c.mode === mode);
                if (dupe)
                    cancel();
            }

            return async ({update, result}) => {
                await update();
                duplicateText = '&nbsp;';
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
                        bind:value={otherCall}
                        on:input={e => {
                            const t = e.target;
                            t.value = t.value.toUpperCase();

                            if (logType.preventDuplicates) {
                                if (t.value.length < 3) {
                                    duplicateText = '&nbsp;';
                                } else {
                                    const dupes = get(contacts).filter(c => c.other_call.includes(t.value))
                                        .filter(c => freqToBand(c.freq_khz) === freqToBand(freqKhz) && c.mode === mode)
                                        .map(c => c.other_call).toSorted();
                                    const exact = dupes.find(c => c === t.value);

                                    if (exact)
                                        duplicateText = '<strong>DUPLICATE:</strong> ' + exact;
                                    else if (dupes.length !== 0)
                                        duplicateText = 'Potential duplicates: ' + dupes.join(', ');
                                    else
                                        duplicateText = '&nbsp;';
                                }
                            }
                        }}
                        on:change={e => {
                            if (logType.autocomplete) {
                                const call = e.target.value.toUpperCase();
                                const contact = get(contacts).find(c => c.other_call === call);

                                if (contact) {
                                    const formInputs = document.getElementById('new-contact-form').elements;
                                    const skipInputs = ['other_call', 'freq_khz', 'mode'];

                                    inputs.filter(i => !skipInputs.includes(i)).forEach(input => {
                                        formInputs[input].value = getContactData(contact, input);
                                    });
                                }
                            }
                        }} />
                </label>

                <OptionalInput name="rst_sent" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="rst_recd" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                <OptionalInput name="name" {inputs} />
                <OptionalInput name="qth" {inputs} />
                <OptionalInput name="c:class" {inputs} maxlength="4" />
                <OptionalInput name="c:arrl_section" {inputs} maxlength="3" />
                <OptionalInput name="c:skcc_nr" {inputs} />
                <OptionalInput name="memo" {inputs} width="50" />

                <button>Save Contact</button>
            </div>

            <div>
                <QuickInput id="freq_khz" name="freq_khz" label="Freq (kHz)" choices={bands} bind:value={freqKhz} width="4" restrict={logType.restrictBands} />
                <QuickInput id="mode" name="mode" label="Mode" choices={modes} bind:value={mode} width="4" restrict={logType.restrictModes} />
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
                            {:else if column === 'band'}
                                <select name="freq_khz">
                                    {#each logType.bands as band}
                                        <option value={bandToFreq(band)}>{band}</option>
                                    {/each}
                                </select>
                            {:else if column === 'mode' && logType.restrictModes}
                                <select name="mode">
                                    {#each logType.modes as mode}
                                        <option value={mode}>{mode}</option>
                                    {/each}
                                </select>
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