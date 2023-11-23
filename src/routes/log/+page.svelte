<script>
    import { page } from '$app/stores';
    import { logTypes } from '$lib/logtype';
    import { myLogs, sharedLogs } from '$lib/store';
    import { onMount } from 'svelte';
    import Log from './Log.svelte';

    onMount(() => {
        document.title = 'Logbooks';
    });

    myLogs.set($page.data.myLogs);
    sharedLogs.set($page.data.sharedLogs);

    $: numLogs = $myLogs.length + $sharedLogs.length;
</script>

<div class="container-narrow">
    <a href="/">Change Call Sign</a>

    <h1>Logbooks</h1>

    <form method="POST" action="?/create">
        <input type="text" name="callsign" placeholder="Call Sign" value={$page.data.callsign} required />
        <input type="text" name="name" placeholder="Name" required />

        <select name="type">
            {#each logTypes.filter((t) => t.display) as type}
                <option value={type.id}>{type.name}</option>
            {/each}
        </select>

        <label>Shared? <input type="checkbox" name="shared" /></label>
        <button>Create Logbook</button>
    </form>

    {#if numLogs === 0}
        <p>You don't have any logbooks yet!</p>
    {:else}
        <div class="log-container">
            <h2>My Logbooks</h2>
            {#each $myLogs as log}
                <Log {...log} />
            {/each}
        </div>
        
        <div class="log-container">
            <h2>Shared Logbooks</h2>
            {#each $sharedLogs as log}
                <Log {...log} />
            {/each}
        </div>
    {/if}
</div>