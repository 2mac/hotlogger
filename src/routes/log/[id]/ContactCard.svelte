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
  id="container"
  class="main-bg"
  style="    display: flex;
flex-direction: column;
align-items: center;
border: solid;
border-color: black;
border-width: thin;
border-radius: .5em;
min-width: 300px;
gap: 4px; 
margin:4px;"
>
  <div
    class="inline-section"
    style="margin-left:auto; justify-content: space-between;"
  >
    <p style="color: lightgray;">{contact.time}</p>
    {#if timestamp}
    <em style="    background-color: aliceblue;
    border-bottom-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    border: solid;
    border-color: aliceblue;"><b>{timestamp}</b> <cite>ago</cite></em>
    {/if}
  </div>
  <div
    style="display:flex; flex-direction:row; align-items:center; gap:4px; width: 100%"
  >
    <div
      style="display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: flex-end;
    border: chartreuse;
    width: 100%;
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
    background: chartreuse;
    padding: 4px; 
    align-items: center"
    >
      <div>
        <p style="color:darkgreen; font-size:small">sent</p>
      </div>
      <div
        style="display:flex; flex-direction:column; align-items:flex-end; margin-left: auto;"
      >
        <p>
          <b>{contact.op_call}</b>
        </p>
        <p>
          <b>{contact.rst_recd}</b>
        </p>
      </div>
    </div>
    <div>
      <p>⇌</p>
      <p>⇌</p>
    </div>
    <div
      style="display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: flex-start;
    border: moccasin;
    width: 100%;
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    background: moccasin;
    padding: 4px;
    align-items: center"
    >
      <div
        style="display:flex; flex-direction:column; align-items:flex-start; margin-right: auto;"
      >
        <p>{contact.other_call}</p>
        <p>{contact.rst_sent}</p>
      </div>

      <div>
        <p style="color:brown; font-size:small;">recv'd</p>
      </div>
    </div>
  </div>
  <div
    style="display: flex;
  width: 100%;
  background: lightgray;"
  >
    <div
      style="    display: flex;
      gap: 4px;
      width: 100%;
      justify-content: center;
      flex-direction: row;
      align-items: center;"
    >
      <p style="font-size: x-small; word-wrap:normal; color: darkgray;">
        Freq/Mode
      </p>
      <p>{contact.freq_khz}kHz/{contact.mode}</p>
    </div>
  </div>
  <div
    style="width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: lightgray;"
  >
    <p style="font-size: small; color:darkgray">memo</p>
    <textarea
      disabled
      rows="5"
      style="line-height: 1.1; width:95%; resize:none;">{contact.memo}</textarea
    >
  </div>
  <div></div>
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
