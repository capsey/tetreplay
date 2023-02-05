<script lang="ts">
    import Board from "./lib/Board.svelte";
    import NavigationBar from "./lib/NavigationBar.svelte";
    import { getSpawnPosition, pieceNames } from "./lib/pieces";
    import SettingsTab from "./lib/SettingsTab.svelte";
    import Toolbar from "./lib/Toolbar.svelte";
    import { board } from "./lib/stores/board";
    import type { Piece } from "./lib/types";

    let piece = getSpawnPosition(0);
    let selected: string;

    $: if (selected) {
        const color = pieceNames.indexOf(selected);
        piece = getSpawnPosition(color);
    }

    function onKeyDown({ key, ctrlKey }: KeyboardEvent) {
        if (key === "z" && ctrlKey) board.undo();
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
        grid-template-columns: min-content 3fr 4fr;
    }

    #background {
        position: absolute;
        top: 0;
        left: 0;

        z-index: -1;

        width: 100%;
        height: 100%;

        background-image: url("https://images.unsplash.com/photo-1673217611194-579eee2a6ff8?auto=format&fit=crop&w=2070&q=80");
        background-size: cover;
        filter: brightness(50%);
    }
</style>
