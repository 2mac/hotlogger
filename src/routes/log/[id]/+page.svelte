<script>

    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import Modal from "$lib/Modal.svelte";
    import { exportFormats, logTypes, contactFields } from "$lib/logtype";
    import { contacts } from "$lib/store";
    import { onDestroy, onMount } from "svelte";
    import { io } from 'socket.io-client';
    import OptionalInput from "./OptionalInput.svelte";
    import QuickInput from "./QuickInput.svelte";
    import dateFormat from 'dateformat';
    import { bandChoices, bandToFreq, commonBands, freqToBand } from "$lib/bands";
    import { get } from "svelte/store";
    import { arrlSections } from "$lib/arrlSection";
    import SectionChecklist from "./SectionChecklist.svelte";

    let myCall = $page.data.callsign;
    const logCall = $page.data.log.callsign;
    let socket;
    let socketStatus = 'not connected';
    let stations = [];

    onMount(() => {
        document.title = $page.data.log.name;

        if ($page.data.log.shared) {
            socket = io({
                auth: { callsign: myCall },
                query: {
                    log: $page.data.log.id,
                    band: freqToBand($page.data.freq_khz),
                    mode: $page.data.mode || '?'
                }
            });

            socket.on('connect', () => {
                socketStatus = 'connected';

                socket.emit('who', null, sockets => {
                    stations = sockets;
                    stations.forEach(station => {
                        if (station.id === socket.id)
                            station.data.callsign += ' (you)';
                    });
                    stations.sort((a, b) => a.data.callsign.localeCompare(b.data.callsign));
                });
            });

            socket.on('join', station => {
                stations.push(station);
                stations.sort((a, b) => a.data.callsign.localeCompare(b.data.callsign));
                stations = stations;
            });

            socket.on('part', stationId => {
                const i = stations.findIndex(s => s.id === stationId);
                stations.splice(i, 1);
                stations = stations;
            });

            socket.on('update', station => {
                if (station.id === socket.id)
                    station.data.callsign += ' (you)';
                
                    const old = stations.find(s => s.id === station.id);
                old.data = station.data;
                stations = stations;
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
                    const i = c.findIndex(c => c.id === contact.id);
                    if (i >= 0) c.splice(i, 1);
                    return c;
                });
            });
        }
    });

    onDestroy(() => {
        socket?.disconnect();
    });

    const logType = logTypes.find(t => t.id === $page.data.log.type);
    const inputs = logType.inputs;
    contacts.set($page.data.contacts);

    let columns = [ 'date', 'time', 'other_call', ...logType.displayFields ];
    if ($page.data.log.shared)
        columns = [...columns, 'op_call'];

    columns = columns.map(k => contactFields[k]);

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

    let score;
    $: score = logType.score?.($page.data.log, $contacts);
</script>

<a href="/log">Back</a>

<h2>
    {$page.data.log.name}
    {#if $page.data.log.shared && logCall !== myCall}
        ({logCall})
    {/if}
</h2>

<div class="container">
    <div class="log-layout">
        <div class="contacts-table scroll">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        
                        {#each columns as column}
                            <th>{column.label}</th>
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
                                <td>{column.data(contact)}</td>
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
                if (logType.preventDuplicates) {
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
                                            .map(c => c.other_call).sort();
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
                                            formInputs[input].value = contactFields[input].data(contact);
                                        });
                                    }
                                }
                            }} />
                    </label>

                    <OptionalInput name="rst_sent" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                    <OptionalInput name="rst_recd" {inputs} maxlength="4" pattern="[1-5][0-9]{'{'}1,2{'}'}[A-Za-z]?" />
                    <OptionalInput name="name" {inputs} />
                    <OptionalInput name="qth" {inputs} />
                    <OptionalInput name="c:class" {inputs} maxlength="4" required />
                    <OptionalInput name="c:arrl_section" {inputs} maxlength="3" required />
                    <OptionalInput name="c:pota_park" {inputs} width="6" />
                    <OptionalInput name="c:skcc_nr" {inputs} />
                    <OptionalInput name="memo" {inputs} width="50" />

                    <button>Save Contact</button>
                </div>

                <div>
                    <QuickInput id="freq_khz" name="freq_khz" label="Freq (kHz)" choices={bands} bind:value={freqKhz} width="4" restrict={logType.restrictBands}
                        required
                        on:change={e => {
                            const value = e.target.value;
                            socket?.emit('change-band', freqToBand(value));
                        }} />
                    <QuickInput id="mode" name="mode" label="Mode" choices={modes} bind:value={mode} width="4" restrict={logType.restrictModes}
                        required
                        on:change={e => {
                            const value = e.target.value;
                            socket?.emit('change-mode', value);
                        }} />
                </div>
            </form>
        </div>
    </div>

    <div class="sidebar">
        <div>
            <a href="/log/{$page.data.log.id}/settings"><button>Logbook Settings</button></a>
        </div>

        <div>
            <form action="/log/{$page.data.log.id}/export">
                <select name="format">
                    {#each Object.keys(logType.exports || {}) as k}
                        <option value={k}>{exportFormats[k].name}</option>
                    {/each}
                    <option value="csv">CSV</option>
                </select>
                <button>Export</button>
            </form>
        </div>
        
        {#if $page.data.log.shared}
            <div>
                Socket status: {socketStatus}
            </div>

            <div>
                <form method="POST" action="?/changeCall">
                    <label>
                        Operator: 
                        <input type="text" name="callsign" value={myCall} style="width:6em" />
                    </label>
                    <button>Change</button>
                </form>
            </div>

            <div>
                <h3>Active Stations</h3>
                <table>
                    <thead>
                        <th>Op</th>
                        <th>Band</th>
                        <th>Mode</th>
                    </thead>

                    <tbody>
                        {#each stations as station}
                            <tr>
                                <td>{station.data.callsign || '?'}</td>
                                <td>{station.data.band || '?'}</td>
                                <td>{station.data.mode || '?'}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}

        {#if logType.contest}
            <h3>Contest Info</h3>

            {#if logType.score}
                <div>
                    <strong>Score: {score}</strong>
                </div>
            {/if}

            {#if inputs.includes('c:arrl_section')}
                <h4>ARRL Section Checklist</h4>
                <SectionChecklist groups={arrlSections} />
            {/if}
        {/if}
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
                        <th>{column.label}</th>
                        <td>
                            {#if column.key === 'other_call'}
                                <input type="text" name="other_call" autocomplete="off" required 
                                    value={editContact.other_call}
                                    on:input={e => {
                                        const t = e.target;
                                        t.value = t.value.toUpperCase();
                                    }} />
                            {:else if column.key === 'band'}
                                <select name="freq_khz">
                                    {#each logType.bands as band}
                                        <option value={bandToFreq(band)} selected={freqToBand(editContact.freq_khz) === band}>{band}</option>
                                    {/each}
                                </select>
                            {:else if column.key === 'mode' && logType.restrictModes}
                                <select name="mode">
                                    {#each logType.modes as mode}
                                        <option value={mode} selected={editContact.mode === mode}>{mode}</option>
                                    {/each}
                                </select>
                            {:else}
                                <input type={column.type}
                                    name={column.key}
                                    value={column.data(editContact)}
                                    required={column.required}
                                    pattern={column.pattern}
                                    autocomplete="off" />
                            {/if}
                        </td>
                    </tr>
                {/each}
            </table>

            <button>Save Contact</button>
            <button formaction="?/delete" on:click={e => {
                confirm('Really delete this contact?') || e.preventDefault();
            }}>Delete Contact</button>
        {/if}
    </form>
</Modal>

<style>
    div.container {
        display: grid;
        grid-template-columns: 4fr 1fr;
    }

    div.sidebar {
        margin-left: 1em;
    }
    
    div.contacts-table {
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