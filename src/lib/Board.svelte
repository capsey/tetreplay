<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import * as paper from "paper";

    import type { Matrix } from "./utilities";
    import { BoardRenderer, getTheme, PieceRenderer } from "./renderers";
    import type { Piece } from "./types";
    import { collides, rotate } from "./rules";
    import { getBlocks, getCenter } from "./pieces";

    // Component props
    export let board: Matrix<number>;
    export let cellSize: number;
    export let piece: Piece;

    let canvas: HTMLCanvasElement;

    const dispatcher = createEventDispatcher<{ place: Piece }>();

    function placePiece() {
        if (previewPiece) dispatcher("place", previewPiece);
    }

    // Collision map
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

    onMount(() => {
        paper.setup(canvas);

        // Fix canvas stretching
        canvas.width = board.cols * cellSize;
        canvas.height = board.rows * cellSize;

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

        const visible = previewPiece && mouseOver;

        previewRenderer.visible = visible;
        cursor = visible ? "pointer" : "inherit";
    }

    // Placing preview
    let previewPiece: Piece | null;
    let cursor = "inherit";

    $: previewPiece = collisionMap
        .map((piece) => {
            let { x, y } = getCenter(piece);
            x -= mouseX;
            y -= mouseY;
            return { piece, distance: x * x + y * y };
        })
        .filter(({ distance }) => distance < 3 * 3)
        .min(({ distance }) => distance)?.piece;

    // Input handling
    let mouseOver = false;
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition({ x, y }: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        // 4 pixels added to account for border
        mouseX = (x - rect.left - 4) / cellSize;
        mouseY = (y - rect.top) / cellSize;
    }

    function movePieceKeyboard({ key }: KeyboardEvent) {
        const oldPiece = previewPiece || piece;
        let newPiece: Piece;

        switch (key) {
            case "e":
                piece = rotate(piece, board, 1);
                break;

            case "w":
                piece = rotate(piece, board, 2);
                break;

            case "q":
                piece = rotate(piece, board, -1);
                break;

            case "ArrowRight":
                newPiece = collisionMap
                    .filter((p) => p.y === oldPiece.y && p.x > oldPiece.x)
                    .min((piece) => piece.x);
                break;

            case "ArrowLeft":
                newPiece = collisionMap
                    .filter((p) => p.y === oldPiece.y && p.x < oldPiece.x)
                    .max((piece) => piece.x);
                break;

            case "ArrowDown":
                newPiece = collisionMap
                    .filter((p) => p.x === oldPiece.x && p.y > oldPiece.y)
                    .min((piece) => piece.y);
                break;

            case "ArrowUp":
                newPiece = collisionMap
                    .filter((p) => p.x === oldPiece.x && p.y < oldPiece.y)
                    .max((piece) => piece.y);
                break;

            case "Enter":
                placePiece();
                break;
        }

        // We can't set `previewPiece` directly here, because
        // if we changed `piece` (rotated it) the `previewPiece`
        // will be updated using mouse position after that
        if (newPiece) {
            const { x, y } = getCenter(newPiece);
            mouseX = x;
            mouseY = y;
        }
    }

    function onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            // Left-click on canvas
            placePiece();
        } else if (event.button === 2) {
            // Right-click on canvas
            piece = rotate(piece, board, 1);
        }
    }
</script>

<div>
    <canvas
        width={board.cols * cellSize}
        height={board.rows * cellSize}
        on:mousemove={updateMousePosition}
        on:keydown={movePieceKeyboard}
        on:mousedown={onMouseDown}
        on:contextmenu|preventDefault
        on:mouseover={() => (mouseOver = true)}
        on:focus={() => (mouseOver = true)}
        on:mouseout={() => (mouseOver = false)}
        on:blur={() => (mouseOver = false)}
        tabindex={0}
        style:cursor
        style:background-size="{cellSize}px"
        bind:this={canvas}
    />
</div>

<style>
    div {
        flex: 1;
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
    }

    canvas {
        background-image: url("assets/board-background.png");
        image-rendering: pixelated;
        border: 4px solid white;
        border-top-style: none;
        box-shadow: 0 0 12px #000000aa;
        box-sizing: border-box;
    }
</style>
