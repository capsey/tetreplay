<script lang="ts">
  import Board from "./lib/Board.svelte";
  import NavigationBar from "./lib/NavigationBar.svelte";
  import SettingsTab from "./lib/SettingsTab.svelte";
  import Toolbar from "./lib/Toolbar.svelte";
</script>

<main>
  <NavigationBar />

  <div>
    <Toolbar />
    <Board rows={22} cols={10} cellSize="24px" />
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
    background-image: url("https://images.unsplash.com/photo-1673217611194-579eee2a6ff8?auto=format&fit=crop&w=2070&q=80");
    background-size: cover;
  }

  div {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>
