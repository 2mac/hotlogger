<script>
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";
</script>

<div class="container-narrow">
    <h2>Set your call sign</h2>

    <form method="POST" use:enhance>
        <input type="text" name="callsign" placeholder="Call Sign" value={$page.data.callsign || ''} required/>
    </form>
</div>