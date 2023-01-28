<script lang="ts">
    export let rows: number;
    export let cols: number;
    export let cellSize: number;
</script>

<main>
    <canvas
        style:--rows={rows}
        style:--cols={cols}
        style:--cell-size="{cellSize}px"
    />
</main>

<style>
    main {
        flex: 1;
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
    }

    canvas {
        width: calc(var(--cell-size) * var(--cols));
        height: calc(var(--cell-size) * var(--rows));
        background-image: url("board-background.png");
        background-size: var(--cell-size);
        image-rendering: pixelated;
        border: 4px solid white;
        border-top: none;
        box-shadow: 0 0 12px #000000aa;
    }
</style>
