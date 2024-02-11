<script>
  import { onMount } from "svelte";

  export let contact;
  let timestamp;
  let doAutoUpdate = true;
  console.log(JSON.stringify(contact));

  onMount(() => {
    timestamp = timeSince(contact.time);
    autoUpdater();
  });

  function autoUpdater() {
    if (doAutoUpdate) {
      setTimeout(() => {
        timestamp = timeSince(contact?.time);
        autoUpdater();
      }, 1000);
    }
  }

  function timeSince(date) {
    let seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "mo";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";
  }
</script>

<div
  style="    display: flex;
flex-direction: column;
align-items: center;
border: solid;
border-color: black;
border-width: thin;
border-radius: 4px;
min-width: 300px;
gap: 4px"
>
  <div class="inline-section" style="margin-left:auto; justify-content: space-between;">
    <p style="color: lightgray;">{contact.time}</p>
    <em><b>{timestamp}</b> <cite>ago</cite></em>
  </div>
  <div style="display:flex; flex-direction:row; align-items:center; gap:4px">
    <div style="display:flex; flex-grow:1; flex-direction: column; align-items:flex-end">
        <p>
            <b>{contact.op_call}</b>
        </p>
        <p>
            <b>{contact.rst_recd}</b>
        </p>
    </div>
    <div>
        <p>⇌</p>
        <p>⇌</p>
    </div>
    <div style="display:flex; flex-grow:1; flex-direction: column; align-items:flex-start">
        <p>{contact.other_call}</p>
        <p>{contact.rst_sent}</p>
    </div>
  </div>
  <div class="inline-section">
    <p>Freq/Mode</p>
    <div>
        <p>{contact.freq_khz}kHz /</p>
        <p>{contact.mode}</p>
    </div>

  </div>
</div>

<style>
  .inline-section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 5px;
    padding-right: 5px;
    width: 95%;
  }
  .field-name {
    min-width: 60px;
  }

  .field-value {
    overflow: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-all;
  }

  b {
    margin: 0px;
  }
  em {
    margin: 0px;
  }
  p {
    margin: 0px;
  }
</style>
