<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import * as paper from "paper";

    import type { Matrix } from "./utilities";
    import { BoardRenderer, getTheme, PieceRenderer } from "./renderers";
    import { rotatePiece, type Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";

    // Component props
    export let board: Matrix<number>;
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

    const dispatcher = createEventDispatcher<{ place: Piece }>();

    function placePiece() {
        if (previewPiece) dispatcher("place", previewPiece);
    }

    // Game board
    let collisionMap: Piece[];

    $: if (board) {
        collisionMap = [];

        // Check every position on the board
        for (let x = -2; x < board.cols; x++) {
            for (let y = -1; y < board.rows; y++) {
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
    let previewPiece: Piece = null;

    onMount(() => {
        paper.setup(canvas);

        boardRenderer = new BoardRenderer(board, cellSize);
        previewRenderer = new PieceRenderer(piece, cellSize, 0.5);

        getTheme("default-tetrominoes.png").then((theme) => {
            boardRenderer.setTheme(theme);
            previewRenderer.setTheme(theme);
        });
    });

    $: if (boardRenderer) {
        boardRenderer.update(board);
    }

    $: if (previewRenderer) {
        if (previewPiece) {
            previewRenderer.setPiece(previewPiece, cellSize);
        }

        const visible = !!previewPiece;
        previewRenderer.visible = visible;
        mouseStyle = visible ? "pointer" : "inherit";
    }

    // Placing preview
    $: {
        previewPiece = collisionMap
            .map((piece) => {
                let { x, y } = getCenter(piece);
                x -= mouseX;
                y -= mouseY;
                return { piece, distance: x * x + y * y };
            })
            .filter(({ distance }) => distance < 5 * 5)
            .min(({ distance }) => distance)?.piece;
    }

    function hidePreview() {
        previewPiece = null;
    }

    // Input handling
    let mouseStyle = "inherit";
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition({ x, y }: MouseEvent) {
        mouseX = (x - canvasX) / cellSize;
        mouseY = (y - canvasY) / cellSize;
    }

    function onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            placePiece();
        } else if (event.button === 2) {
            piece = rotatePiece(piece, 1);
        }
    }
</script>

<main
    on:mousemove={updateMousePosition}
    on:mouseout={hidePreview}
    on:mousedown={onMouseDown}
    on:contextmenu|preventDefault
    on:blur={hidePreview}
    style:cursor={mouseStyle}
>
    <canvas
        width={board.cols * cellSize - 8}
        height={board.rows * cellSize - 4}
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
        background-image: url("board-background.png");
        background-size: var(--cell-size);
        image-rendering: pixelated;
        border: 4px solid white;
        border-top-style: none;
        box-shadow: 0 0 12px #000000aa;
    }
</style>
