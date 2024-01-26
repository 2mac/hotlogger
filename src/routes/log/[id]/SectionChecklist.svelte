<script>
    import { contacts } from "$lib/store";

    export let groups;
    export let sectionKey = 'arrl_section';

    let uniqueSections = new Set();

    function setSections(contacts) {
        uniqueSections.clear();
        contacts.forEach(c => uniqueSections.add(c.custom[sectionKey]));
        uniqueSections = uniqueSections;
    }

    function headerClass(logged, sections) {
        const count = sections.reduce((total, next) => logged.has(next[0]) ? total + 1 : total, 0);
        return count === sections.length ? 'logged-all' :
            count > 0 ? 'logged-partial' :
            '';
    }

    $: setSections($contacts);
</script>

<div class="scroll groups">
    {#each Object.entries(groups) as [group, sections]}
        <div>
            <div class="header {headerClass(uniqueSections, sections)}">{group}</div>
    
            <div class="sections">
                {#each sections as [abbr, name]}
                    <div title={name} class={uniqueSections.has(abbr) ? 'logged' : ''}>{abbr}</div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
div.groups {
    display: flex;
    flex-wrap: wrap;
}

div.groups > div {
    flex: 6em;
    border: thin solid;
    margin: 2px;
}

div.header {
    background-color: black;
    color: white;
    font-weight: bold;
    text-align: center;
}

div.logged-partial {
    background-color: darkblue;
}

div.logged-all {
    background-color: green;
}

div.sections {
    display: flex;
    flex-wrap: wrap;
    padding: 2px;
}

div.sections > div {
    flex: 3em;
    text-align: center;
    font-weight: bold;
}

div.logged {
    color: green;
}
</style>