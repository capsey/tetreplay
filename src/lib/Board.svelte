<script lang="ts">
    import { onMount } from "svelte";
    import * as paper from "paper";

    import { Matrix } from "./utilities";
    import { BoardRenderer, getTheme } from "./renderers";

    // Component props
    export let rows: number;
    export let cols: number;
    export let cellSize: number;

    // Setup canvas rendering
    let board = new Matrix<number>(rows, cols, -1);
    let canvas: HTMLCanvasElement;
    let renderer: BoardRenderer;

    onMount(() => {
        paper.setup(canvas);

        renderer = new BoardRenderer(rows, cols, cellSize);
        getTheme("default-tetrominoes.png").then((theme) =>
            renderer.setTheme(theme)
        );

        board.forEach((x, y) => {
            if (Math.random() > 0.2) return;

            const color = Math.floor(Math.random() * 7);
            board.setItem(x, y, color);
            renderer.setBlock(x, y, color);
        });
    });
</script>

<main>
    <canvas
        style:--rows={rows}
        style:--cols={cols}
        style:--cell-size="{cellSize}px"
        bind:this={canvas}
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
        width: calc(var(--cell-size) * var(--cols) - 8px);
        height: calc(var(--cell-size) * var(--rows) - 4px);
        background-image: url("board-background.png");
        background-size: var(--cell-size);
        image-rendering: pixelated;
        border: 4px solid white;
        border-top: none;
        box-shadow: 0 0 12px #000000aa;
    }
</style>
