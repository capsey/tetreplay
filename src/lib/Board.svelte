<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { tweened } from "svelte/motion";

    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";
    import { lastClearedLines } from "./stores/board";
    import type { BoardState, Piece } from "./types";
    import BoardRenderer from "./BoardRenderer.svelte";
    import BoardAnimation from "./BoardAnimation.svelte";
    import { theme } from "./stores/preferences";

    // Component props
    export let board: BoardState;
    export let piece: Piece;

    let rotation: number = 0;
    $: if (piece) rotation = 0; // Reset rotation when user selects another piece

    // Custom events
    const dispatcher = createEventDispatcher<{ place: Piece }>();

    function placePiece() {
        if (preview) dispatcher("place", preview);
    }

    // Canvas elements
    let boardCanvas: HTMLCanvasElement;
    let clearCanvas: HTMLCanvasElement;

    let clearTransform: { x: number; y: number; scale: number };

    $: if (boardCanvas && clearCanvas && cell) {
        const boardRect = boardCanvas.getBoundingClientRect();
        const clearRect = clearCanvas.getBoundingClientRect();

        const border = (boardRect.width - cell * board.cols) / 2;

        clearTransform = {
            x: boardRect.x - clearRect.x + border,
            y: boardRect.y - clearRect.y,
            scale: cell,
        };
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
                const collidesBoard = collides(shiftedBlocks, (x, y) =>
                    board.isEmpty(x, y)
                );

                if (!collidesBoard) {
                    collisionMap.push(shiftedPiece);
                }
            }
        }
    }

    // Placing preview
    let preview: Piece | null;
    $: preview = collisionMap
        .map((piece) => {
            let { x, y } = getCenter(piece);
            x -= mouseX;
            y -= mouseY;
            return { piece, distance: x * x + y * y };
        })
        .filter(({ distance }) => distance < 3 * 3)
        .min(({ distance }) => distance)?.piece;

    let cursor = "inherit";
    $: cursor = preview ? "pointer" : "inherit";

    // Canvas animation
    const easing = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
    const func = (x: number) => -4 * x * (x - 1);

    let translateProgress = tweened(0, { easing });
    let translateAmplitude = 0;
    let translate = 0;

    $: translate = translateAmplitude * cell * func($translateProgress);

    lastClearedLines.subscribe((event) => {
        if (event.points <= 0) return;

        const duration = 400 * Math.sqrt(event.points) + 200;

        translateAmplitude = event.points / 4;
        translateProgress.set(0, { duration: 0 });
        translateProgress.set(1, { duration });
    });

    // Input handling
    let mouseX = -100;
    let mouseY = -100;

    function updateMousePosition({ x, y }: MouseEvent) {
        const rect = boardCanvas.getBoundingClientRect();
        mouseX = (board.cols * (x - rect.left)) / rect.width;
        mouseY = (board.rows * (y - rect.top)) / rect.height;
    }

    function mouseOut() {
        preview = null;
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
        const oldPiece = preview || { ...piece, rotation };
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

    // Canvas dynamic size
    let container: HTMLDivElement;
    let containerWidth: number;
    let containerHeight: number;
    let cell: number = 24;

    $: if (containerHeight) {
        cell = Math.min(
            (0.9 * containerHeight) / board.rows,
            (0.9 * containerWidth) / board.cols
        );

        // Increment for less pixel distortion
        // Unless it's too small for it to matter
        const increment = $theme.size;

        if (cell > increment) {
            cell = Math.floor(cell / increment) * increment;
        }
    }
</script>

<div
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
    bind:this={container}
>
    <canvas
        id="board-canvas"
        tabindex={0}
        style:--rows={board.rows}
        style:--cols={board.cols}
        style:--cell="{cell}px"
        style:--offset="{translate}px"
        style:cursor
        on:mousemove={updateMousePosition}
        on:mousedown={mouseClick}
        on:keydown={keyboardInput}
        on:contextmenu|preventDefault
        on:mouseout={mouseOut}
        on:blur={mouseOut}
        bind:this={boardCanvas}
    />
    <canvas id="clear-canvas" bind:this={clearCanvas} />

    <BoardRenderer {board} {preview} canvas={boardCanvas} />
    <BoardAnimation transform={clearTransform} canvas={clearCanvas} />
</div>

<style>
    div {
        grid-area: board;

        position: relative;
        display: flex;

        width: 100%;
        height: 100%;

        min-width: 0;
        min-height: 0;
    }

    #board-canvas {
        margin: auto;
        box-sizing: content-box;

        width: calc(var(--cell) * var(--cols));
        height: calc(var(--cell) * var(--rows));

        border: calc(1.5 * var(--border)) white;
        border-style: none solid solid solid;

        background-image: url("assets/board-background.png");
        background-size: contain;
        image-rendering: crisp-edges;

        box-shadow: 0 0 var(--shadow-radius) var(--shadow-color);

        translate: 0 var(--offset);
    }

    #clear-canvas {
        position: absolute;

        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        pointer-events: none;
    }
</style>
