<script>
  import { onMount } from "svelte";

  export let columns;
  export let contact;

  let timestamp;
  let doAutoUpdate = true;
  let bgcolor = "beige";

  onMount(() => {
    if (lessThanNSecondsAgo(contact.time, 4)) {
      bgcolor = "lightgreen";
    }
    timestamp = timeSince(contact.time);

    setInterval(() => {
      if (doAutoUpdate) {
        if (!lessThanNSecondsAgo(contact.time, 4)) {
          bgcolor = "beige";
        } else {
          bgcolor = "lightgreen";
        }
        timestamp = timeSince(contact.time);
      } else {
        return;
      }
    }, 1000);
  });

  function lessThanNSecondsAgo(timestamp, n) {
    return new Date().getTime() - new Date(timestamp).getTime() < n * 1000;
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
    return "<1m";
  }
</script>

<div id="container" class="main-bg" style="background-color:{bgcolor}">
  <div
    style="display: flex;
      justify-content: space-around;
      width: 100%;
      align-items: center;"
  >
    <p
      style="    margin-left: 4px;
    font-variant: all-small-caps;
    opacity: 50%;"
    >
      contact
    </p>
    {#if timestamp}
      <p
        style="    background-color: aliceblue;
        border-top-right-radius: 0.5em;
        border-bottom-left-radius: 0.5em;
        border-bottom: solid black thin;
        border-left: solid black thin;
        padding-right: 2px;
        padding-left: 4px;
        padding-bottom: 2px;
        margin-left:auto;"
      >
        <b>{timestamp}</b> <em>ago</em>
      </p>
    {/if}
  </div>

  <div
    style="display:flex; flex-direction: row; flex-wrap: wrap; overflow-y:scroll; border-top:solid black thin; border-bottom: solid black thin"
  >
    <!--<div style="border-bottom: solid black thin; width:100%"></div>-->
    {#each columns as column}
      <div class="inline-section" style="border-bottom:solid black thin;">
        <div
          style="width:5em; border-bottom: solid grey thin; background: grey; color:white; padding-left:2px; padding-right:2px"
        >
          <em>{column.label}</em>
        </div>
        <div style="display: flex; flex-direction:row;">
          <div
            style="width:1em; display: flex; flex-direction:column; background: white"
          >
            <div style="flex-grow:1; background: grey"></div>
            <div
              style="flex-grow:1; border-right: solid grey thin;border-bottom: solid grey thin; border-bottom-right-radius: 90%; background:grey"
            ></div>
          </div>
          <div
            style="width:1em; display:flex; flex-direction:column; background: grey"
          >
            <div
              style="flex-grow:1; border-top: solid grey thin; border-top-left-radius: 90%; background:white"
            ></div>
            <div style="flex-grow:1; background:white"></div>
          </div>
        </div>
        <div
          style="flex-grow:1; border-top: solid grey thin; background: white"
        >
          <p>{column.data(contact)}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .inline-section {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  b {
    display: inline;
    width: fit-content;
    margin: 0px;
  }
  em {
    margin: 0px;
  }
  p {
    margin: 0px;
    display: inline;
    width: fit-content;
  }

  .main-bg {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid;
    border-color: black;
    border-width: thin;
    border-radius: 0.5em;
    min-width: 300px;
    height:100%;
    gap: 4px;
    margin: 4px;
    padding-bottom: 20px;
    overflow: hidden;
    transition-duration: 1s;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: grey;
    border: solid rgb(56, 56, 56) thin;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: darkgray;
    border-radius: 2em;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(57, 64, 70);
  }
</style>
