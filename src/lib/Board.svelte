<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { Matrix } from "./utilities";
    import { rotatePiece, type Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";
    import { theme } from "./stores/preferences";
    import { drawBoard, drawPiece } from "./rendering";

    // Component props
    export let board: Matrix<number>;
    export let cellSize: number;
    export let piece: Piece;

    export let clientWidth: number = 0;
    export let clientHeight: number = 0;

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
                const shiftedPiece: Piece = { ...piece, x, y };

                // Add if can be placed there
                if (!collides(getBlocks(shiftedPiece), board)) {
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

    // Setup canvas rendering
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    $: context = canvas?.getContext("2d");

    $: if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw board cells
        drawBoard(context, board, $theme, cellSize);

        // Draw preview piece
        if (previewPiece && mouseOver) {
            drawPiece(context, previewPiece, $theme, cellSize, 0.25);
        }
    }

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

    function mouseClick(event: MouseEvent) {
        if (event.button === 0) {
            // Left-click on canvas
            placePiece();
        } else if (event.button === 2) {
            // Right-click on canvas
            piece = rotatePiece(piece, 1);
        }
    }

    function keyboardInput({ key }: KeyboardEvent) {
        const oldPiece = previewPiece || piece;
        let newPiece: Piece;

        switch (key) {
            // Rotate clockwise
            case "e":
                piece = rotatePiece(piece, 1);
                break;
            // Rotate 180 degrees
            case "w":
                piece = rotatePiece(piece, 2);
                break;
            // Rotate counter-clockwise
            case "q":
                piece = rotatePiece(piece, -1);
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
        if (newPiece) {
            const { x, y } = getCenter(newPiece);
            mouseX = x;
            mouseY = y;
        }
    }
</script>

<div bind:clientHeight={clientHeight} bind:clientWidth={clientWidth}>
    <canvas
        width={board.cols * cellSize}
        height={board.rows * cellSize}
        on:mousemove={updateMousePosition}
        on:mousedown={mouseClick}
        on:keydown={keyboardInput}
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
        overflow: hidden;

        display: grid;
        align-items: center;
        justify-items: center;
    }

    canvas {
        border: 4px solid white;
        border-top-style: none;
        box-sizing: border-box;

        background-image: url("assets/board-background.png");
        image-rendering: pixelated;

        box-shadow: 0 0 12px #000000aa;
    }
</style>
