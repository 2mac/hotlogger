<script>
    import { page } from "$app/stores";
    import { contactFields } from "$lib/logtype";

    export let name;
    export let value = $page.data[name];
    export let inputs;
    export let maxlength;
    export let pattern;
    export let width;
    export let required = false;
    export let type = "text";
</script>

{#if inputs.includes(name)}
    <span>
        <label>
            {contactFields[name].label}:
            <input {type} {name} {maxlength} {pattern} value={value || ''} style="flex-grow:1" autocomplete="off" {required} />
        </label>
    </span>
{/if}

<style>
    span {
        display:flex;
        white-space: nowrap;
        flex-grow:1;
    }
</style>