<script lang="ts">
    import { onMount } from "svelte";
    import * as paper from "paper";

    import { Matrix } from "./utilities";
    import { BoardRenderer, getTheme, PieceRenderer } from "./renderers";
    import { rotatePiece, type Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";

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
    let board: Matrix<number>;
    let collisionMap: Piece[];

    $: board = new Matrix<number>(rows, cols, -1);

    $: if (board) {
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
    let previewPiece: Piece;

    function hidePreview() {
        previewPiece = null;
    }

    onMount(() => {
        paper.setup(canvas);

        boardRenderer = new BoardRenderer(rows, cols, cellSize);
        previewRenderer = new PieceRenderer(piece, cellSize, 0.5);
        previewRenderer.visible = false;

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

        const visible = !!previewPiece;
        previewRenderer.visible = visible;
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

    function onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            placePiece(previewPiece);
        } else if (event.button === 2) {
            piece = rotatePiece(piece, 1);
        }
    }

    function onKeyDown(event: KeyboardEvent) {
        function boundaryClamp(x: number, max: number) {
            const result = Math.min(Math.max(Math.floor(x), 0), max - 1) + 0.5;
            console.log(result);

            return result;
        }

        console.log(mouseX);
        if (event.key === "Enter") {
            placePiece(previewPiece);
        } else if (event.key === "r") {
            piece = rotatePiece(piece, 1);
        } else if (event.key === "ArrowLeft") {
            mouseX = boundaryClamp(mouseX - 1, cols);
        } else if (event.key === "ArrowRight") {
            mouseX = boundaryClamp(mouseX + 1, cols);
        } else if (event.key === "ArrowUp") {
            mouseY = boundaryClamp(mouseY - 1, rows);
        } else if (event.key === "ArrowDown") {
            mouseY = boundaryClamp(mouseY + 1, rows);
        }
    }

    function placePiece(piece: Piece) {
        if (!piece) return;

        getBlocks(piece).forEach((block) =>
            board.setItem(block.x, block.y, piece.type)
        );
        board = board;
    }

    $: previewPiece = collisionMap
        .map((piece) => {
            let { x, y } = getCenter(piece);
            x -= mouseX;
            y -= mouseY;

            // Calculate Euclidean distance
            return { piece, distance: x * x + y * y };
        })
        .filter(({ distance }) => distance < 5 * 5)
        .min(({ distance }) => distance)?.piece;
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<main
    on:mousemove={updateMousePosition}
    on:mouseout={hidePreview}
    on:mousedown={onMouseDown}
    on:contextmenu|preventDefault
    on:blur={hidePreview}
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
