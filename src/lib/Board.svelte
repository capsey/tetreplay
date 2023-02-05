<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import type { BoardState, ColoredBlock, Piece } from "./types";
    import { collides } from "./rules";
    import { getBlocks, getCenter } from "./pieces";
    import { theme } from "./stores/preferences";
    import {
        drawBoard,
        drawPiece,
        drawUnalignedBlock,
        type UnalignedBlock,
    } from "./rendering";
    import { lastCleared } from "./stores/board";

    // Component props
    export let board: BoardState;
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

    $: if (context) {
        // Reset canvas
        canvas.width = $theme.size * board.cols;
        canvas.height = $theme.size * board.rows;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;

        // Draw board cells
        drawBoard(context, board, $theme);

        // Draw preview piece
        if (previewPiece && mouseOver) {
            drawPiece(context, previewPiece, $theme, 0.25);
        }
    }

    // Line clear animation
    type ClearedBlock = UnalignedBlock & {
        opacity: number;
        vr: number;
        vx: number;
        vy: number;
    };

    let clearCanvas: HTMLCanvasElement;
    let clearContext: CanvasRenderingContext2D;
    let clearBlocks: ClearedBlock[] = [];

    $: clearContext = clearCanvas?.getContext("2d");

    let translateProgress = tweened(0, { duration: 500, easing: cubicOut });
    let translate = 0;

    const func = (x: number) => -4 * x * (x - 1);

    $: translate = 0.66 * cell * func($translateProgress);

    const unsubscribe = lastCleared.subscribe((blocks) => {
        if (!canvas) return;

        translateProgress.set(0, { duration: 0 });
        translateProgress.set(1);

        const rect1 = canvas.getBoundingClientRect();
        const border = (rect1.width - cell * board.cols) / 2;

        const random = () => Math.random() - 0.5;
        const newBlocks = blocks.map((block) => {
            return {
                ...block,
                x: (block.x + 0.5) * cell + border,
                y: (block.y + 0.5) * cell,
                rotation: 0,
                opacity: 1,
                vr: random() * 20,
                vx: random() * 100,
                vy: random() * 100,
            };
        });
        clearBlocks = [...clearBlocks, ...newBlocks];
        requestAnimationFrame(renderClearedBlocks);
    });

    onDestroy(unsubscribe);

    let time = performance.now();

    function renderClearedBlocks() {
        if (!clearBlocks || !clearCanvas || !clearContext) return;

        // Calculate elapsed
        const now = performance.now();
        const elapsed = Math.min(now - time, 100) / 1000;

        time = now;

        // Reset canvas
        clearCanvas.width = containerWidth;
        clearCanvas.height = containerHeight;

        clearContext.clearRect(0, 0, canvas.width, canvas.height);
        clearContext.imageSmoothingEnabled = false;

        const rect1 = canvas.getBoundingClientRect();
        const rect2 = clearCanvas.getBoundingClientRect();

        // Draw all blocks
        clearContext.save();
        clearContext.translate(rect1.x - rect2.x, rect1.y - rect2.y);

        const gravity = cell * 20;
        const fading = 3;

        for (let i = clearBlocks.length - 1; i >= 0; i--) {
            const block = clearBlocks[i];

            block.x += block.vx * elapsed;
            block.y += block.vy * elapsed;
            block.vy += gravity * elapsed;
            block.rotation += block.vr * elapsed;
            block.opacity -= fading * elapsed;

            if (block.opacity < 0) {
                clearBlocks.remove(i);
                continue;
            }

            drawUnalignedBlock(
                clearContext,
                block,
                $theme,
                block.opacity,
                cell
            );
        }

        clearContext.restore();

        // Request another frame
        requestAnimationFrame(renderClearedBlocks);
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

    // Canvas dynamic size
    let container: HTMLDivElement;
    let containerWidth: number;
    let containerHeight: number;
    let cell: number = 24;

    $: if (containerHeight) {
        const padding = parseFloat(
            window.getComputedStyle(container).getPropertyValue("padding")
        );

        cell = Math.min(
            (containerHeight - 2 * padding) / board.rows,
            (containerWidth - 2 * padding) / board.cols
        );

        // Increment for less pixel distortion
        // Unless it's too small for it to matter
        const increment = 12;
        if (cell > 24) cell = Math.floor(cell / increment) * increment;
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
        style:width="{cell * board.cols}px"
        style:height="{cell * board.rows}px"
        style:translate="0 {translate}px"
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
    <canvas id="clear-canvas" bind:this={clearCanvas} />
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

        padding: 1.2rem;
    }

    #board-canvas {
        margin: auto;
        box-sizing: content-box;

        border: calc(1.5 * var(--border)) white;
        border-style: none solid solid solid;

        background-image: url("assets/board-background.png");
        background-size: contain;
        image-rendering: pixelated;

        box-shadow: 0 0 var(--shadow-radius) var(--shadow-color);
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
