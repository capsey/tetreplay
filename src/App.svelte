<script lang="ts">
    import { getSpawnPosition } from "./lib/pieces";
    import { board } from "./lib/stores/board";
    import type { PieceType, Piece } from "./lib/types";

    import Board from "./lib/Board.svelte";
    import NavigationBar from "./lib/NavigationBar.svelte";
    import SettingsTab from "./lib/SettingsTab.svelte";
    import Toolbar from "./lib/Toolbar.svelte";

    let piece = getSpawnPosition("i-piece");
    let selected: PieceType;

    $: if (selected) {
        piece = getSpawnPosition(selected);
    }

    function onKeyDown({ key }: KeyboardEvent) {
        if (key === "Backspace") board.clear();
    }

    function onPiecePlaced({ detail }: CustomEvent<Piece>) {
        board.placePiece(detail);
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<div id="background" />
<div id="container">
    <NavigationBar />
    <Toolbar bind:selected />
    <Board board={$board} {piece} on:place={onPiecePlaced} />
    <SettingsTab />
</div>

<style>
    #container {
        display: grid;

        width: 100%;
        height: 100%;

        grid-template-areas:
            "navbar  navbar navbar"
            "toolbar board  settings";

        grid-template-rows: min-content auto;
        grid-template-columns: min-content 1fr 1fr;
    }

    #background {
        position: fixed;
        inset: 0;
        z-index: -1;

        background-image: url("https://images.unsplash.com/photo-1673217611194-579eee2a6ff8?auto=format&fit=crop&w=2070&q=80");
        background-size: cover;
        background-repeat: no-repeat;
        filter: brightness(50%);
    }
</style>
