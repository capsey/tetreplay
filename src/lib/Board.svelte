<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { Matrix } from "./utilities";
    import type { Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";
    import { theme } from "./stores/preferences";
    import { drawBoard, drawPiece } from "./rendering";

    // Component props
    export let board: Matrix<number>;
    export let piece: Piece;

    let rotation: number = 0;

    // Reset rotation when user selects another piece
    $: if (piece) rotation = 0;

    // Custom events
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
                const shiftedPiece: Piece = { ...piece, rotation, x, y };
                const shiftedBlocks = getBlocks(shiftedPiece);

                // Add if can be placed there
                const collidesBoard = collides(shiftedBlocks, board);

                if (!collidesBoard) {
                    collisionMap.push(shiftedPiece);
                }
            }
        }
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

    $: cursor = previewPiece && mouseOver ? "pointer" : "inherit";

    // Canvas rendering
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    $: context = canvas?.getContext("2d");

    $: if (context && $theme) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;

        // Draw board cells
        drawBoard(context, board, $theme);

        // Draw preview piece
        if (previewPiece && mouseOver) {
            drawPiece(context, previewPiece, $theme, 0.25);
        }
    }

    // Input handling
    let mouseOver = false;
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition({ x, y }: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (board.cols * (x - rect.left)) / rect.width;
        mouseY = (board.rows * (y - rect.top)) / rect.height;
    }

    function mouseClick({ button }: MouseEvent) {
        switch (button) {
            // Left-click on canvas
            case 0:
                placePiece();
                break;
            // Right-click on canvas
            case 2:
                rotation = (rotation + 1 + 4) % 4;
                break;
        }
    }

    function keyboardInput({ key }: KeyboardEvent) {
        const oldPiece = previewPiece || { ...piece, rotation };
        let newPiece = oldPiece;

        switch (key) {
            // Rotate clockwise
            case "e":
                rotation = (rotation + 1 + 4) % 4;
                break;
            // Rotate 180 degrees
            case "w":
                rotation = (rotation + 2 + 4) % 4;
                break;
            // Rotate counter-clockwise
            case "q":
                rotation = (rotation - 1 + 4) % 4;
                break;
            // Move to the right
            case "ArrowRight":
                newPiece = collisionMap
                    .filter((p) => p.y === oldPiece.y && p.x > oldPiece.x)
                    .min((piece) => piece.x);
                break;
            // Move to the left
            case "ArrowLeft":
                newPiece = collisionMap
                    .filter((p) => p.y === oldPiece.y && p.x < oldPiece.x)
                    .max((piece) => piece.x);
                break;
            // Move downwards
            case "ArrowDown":
                newPiece = collisionMap
                    .filter((p) => p.x === oldPiece.x && p.y > oldPiece.y)
                    .min((piece) => piece.y);
                break;
            // Move upwards
            case "ArrowUp":
                newPiece = collisionMap
                    .filter((p) => p.x === oldPiece.x && p.y < oldPiece.y)
                    .max((piece) => piece.y);
                break;
            // Place the piece
            case "Enter":
                placePiece();
                break;
        }

        // We can't set `previewPiece` directly here, because
        // if we changed `piece` (rotated it) the `previewPiece`
        // will be updated using mouse position after that
        const { x, y } = getCenter(newPiece);
        mouseX = x;
        mouseY = y;
    }

    // Canvas dinamic size
    let containerWidth: number;
    let containerHeight: number;
    let width: string;
    let height: string;

    $: if (containerHeight) {
        let cell = Math.min(
            containerHeight / board.rows,
            containerWidth / board.cols
        );

        // Increment for less pixel distortion
        // Unless it's too small for it to matter
        const increment = 12;
        if (cell > 24) cell = Math.floor(cell / increment) * increment;

        height = cell * board.rows + "px";
        width = cell * board.cols + "px";
    }
</script>

<div bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
    <canvas
        width={$theme.size * board.cols}
        height={$theme.size * board.rows}
        tabindex={0}
        style:width
        style:height
        style:cursor
        on:mousemove={updateMousePosition}
        on:mousedown={mouseClick}
        on:keydown={keyboardInput}
        on:contextmenu|preventDefault
        on:mouseover={() => (mouseOver = true)}
        on:focus={() => (mouseOver = true)}
        on:mouseout={() => (mouseOver = false)}
        on:blur={() => (mouseOver = false)}
        bind:this={canvas}
    />
</div>

<style>
    div {
        display: flex;

        width: calc(100% - 2.4rem);
        height: calc(100% - 2.4rem);

        min-width: 0;
        min-height: 0;

        margin: 1.2rem;
    }

    canvas {
        margin: auto;
        box-sizing: content-box;

        border: calc(1.5 * var(--border)) white;
        border-style: none solid solid solid;

        background-image: url("assets/board-background.png");
        background-size: contain;
        image-rendering: pixelated;

        box-shadow: 0 0 var(--shadow-radius) var(--shadow-color);
    }
</style>
