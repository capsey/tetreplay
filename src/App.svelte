<script lang="ts">
    import Board from "./lib/Board.svelte";
    import NavigationBar from "./lib/NavigationBar.svelte";
    import { getSpawnPosition } from "./lib/pieces";
    import SettingsTab from "./lib/SettingsTab.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import { board } from "./lib/stores/board";
    import type { Piece } from "./lib/types";

    let piece = getSpawnPosition(0);

    function onKeyDown({ key, ctrlKey }: KeyboardEvent) {
        if (key === "z" && ctrlKey) board.undo();
        if (key === "Backspace") board.clear();
    }

    function onPieceSelected(event: CustomEvent<number>) {
        const color = event.detail;
        piece = getSpawnPosition(color);
    }

    function onPiecePlaced({ detail }: CustomEvent<Piece>) {
        board.placePiece(detail);
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<NavigationBar />
<div id="background" />
<div id="container">
    <Toolbar on:selected={onPieceSelected} />
    <Board board={$board} cellSize={24} {piece} on:place={onPiecePlaced} />
    <SettingsTab />
</div>

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
    }

    #container {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: row;
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
</style>
