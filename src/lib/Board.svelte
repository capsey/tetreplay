<script lang="ts">
    import { onMount } from "svelte";
    import * as paper from "paper";

    import { Matrix } from "./utilities";
    import { BoardRenderer, getTheme, PieceRenderer } from "./renderers";
    import type { Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter, getSpawnPosition } from "./pieces";

    // Component props
    export let rows: number;
    export let cols: number;
    export let cellSize: number;
    export let piece: Piece;

    let canvas: HTMLCanvasElement;
    let canvasX: number;
    let canvasY: number;

    $: if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvasX = rect.left;
        canvasY = rect.top;
    }

    // Game board
    let board = new Matrix<number>(rows, cols, -1);
    let collisionMap: Piece[] = [];

    $: {
        collisionMap = [];
        // Check every position on the board
        for (let x = -2; x < cols; x++) {
            for (let y = -1; y < rows; y++) {
                const shiftedPiece: Piece = { ...piece, x, y };

                // Add if can be placed there
                if (!collides(getBlocks(shiftedPiece), board)) {
                    collisionMap.push(shiftedPiece);
                }
            }
        }
    }

    // Setup canvas rendering
    let boardRenderer: BoardRenderer;
    let previewRenderer: PieceRenderer;

    let previewPiece = piece;

    onMount(() => {
        paper.setup(canvas);

        boardRenderer = new BoardRenderer(rows, cols, cellSize);
        previewRenderer = new PieceRenderer(piece, cellSize, 1);

        getTheme("default-tetrominoes.png").then((theme) => {
            boardRenderer.setTheme(theme);
            previewRenderer.setTheme(theme);
        });
    });

    $: if (boardRenderer) {
        board.forEach((x, y, color) => boardRenderer.setBlock(x, y, color));
    }

    $: if (previewRenderer) {
        if (previewPiece) {
            previewRenderer.setPiece(previewPiece, cellSize);
        }

        const visible = previewPiece;
        previewRenderer.visible = visible ? true : false;
        mouseStyle = visible ? "pointer" : "inherit";
    }

    // Input handling
    let mouseStyle = "inherit";
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition({ x, y }) {
        mouseX = (x - canvasX) / cellSize;
        mouseY = (y - canvasY) / cellSize;
    }

    $: {
        // Find valid placement closest to the mouse
        const placement = collisionMap
            .map((piece) => {
                let { x, y } = getCenter(piece);
                x -= mouseX;
                y -= mouseY;

                // Calculate Euclidean distance
                return { piece, distance: x * x + y * y };
            })
            .filter(({ distance }) => distance < 5 * 5)
            .min(({ distance }) => distance)?.piece;

        // If found, display on the board
        previewPiece = placement;
    }
</script>

<main
    on:mousemove={updateMousePosition}
    on:mouseout={() => (previewPiece = null)}
    on:blur={() => (previewPiece = null)}
    style:cursor={mouseStyle}
>
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
