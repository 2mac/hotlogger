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

    if (!width)
        width = maxlength ? maxlength : 10;
</script>

{#if inputs.includes(name)}
    <span>
        <label>
            {contactFields[name].label}:
            <input {type} {name} {maxlength} {pattern} value={value || ''} style="width:{width}em" autocomplete="off" {required} />
        </label>
    </span>
{/if}

<style>
    span {
        max-width: 100%;
        margin: 0.5em 0.5em 0.5em 0;
        white-space: nowrap;
    }
</style>