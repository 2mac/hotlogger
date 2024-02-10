<script>
    import { logTypes } from "$lib/logtype";

    export let id;
    export let name;
    export let type;
    export let created;
    export let updated;
</script>

<a href="/log/{id}">
    <div class="log-tile">
        <div class="log-name"><h3>{name}</h3></div>
        <div class="log-date">Created {created}</div>

        <div class="log-type">{logTypes.find(t => t.id === type).name}</div>
        <div class="log-date">Last changed {updated}</div>
    </div>
</a>

<style>
    .log-tile {
        display: grid;
        grid-template-columns: 2fr 1fr;
        border: thin solid;
        padding: 5px;
        margin: 2px;
    }

    .log-date {
        margin-left: auto;
    }

    .log-type {
        margin-top: auto;
    }

    h3 {
        margin: 0;
    }
</style>