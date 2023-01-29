<script lang="ts">
  import Board from "./lib/Board.svelte";
  import NavigationBar from "./lib/NavigationBar.svelte";
  import { getSpawnPosition } from "./lib/pieces";
  import SettingsTab from "./lib/SettingsTab.svelte";
  import Toolbar from "./lib/Toolbar.svelte";

  let piece = getSpawnPosition(0);

  function onPieceSelected(event) {
    const color = event.detail;
    piece = getSpawnPosition(color);
  }
</script>

<main>
  <div id="background" />

  <NavigationBar />

  <div id="container">
    <Toolbar on:selected={onPieceSelected} />
    <Board rows={22} cols={10} cellSize={24} {piece} />
    <SettingsTab />
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  #background {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-image: url("https://images.unsplash.com/photo-1673217611194-579eee2a6ff8?auto=format&fit=crop&w=2070&q=80");
    background-size: cover;
    filter: brightness(50%);
  }

  #container {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
