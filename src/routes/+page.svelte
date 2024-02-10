<script>
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
    import { onMount } from "svelte";

    onMount(() => document.title = 'HotLogger');
</script>

<div class="container-narrow">
    <div class="center">
        <img src="/hotlogger-main.png" alt="HotLogger Logo" />
        
        <h2>Set your call sign</h2>
    
        <form method="POST" use:enhance>
            <input type="text" name="callsign" placeholder="Call Sign" value={$page.data.callsign || ''} required/>
            <button>Sign in</button>
        </form>
    </div>
</div>

<style>
    img {
        padding-top: 10vh;
        height: 30vh;
        margin: auto;
    }

    div.center {
        text-align: center;
    }
</style>