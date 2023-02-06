<script lang="ts">
    import { drawBoard, drawPiece } from "./rendering";
    import { theme } from "./stores/preferences";
    import type { BoardState, Piece } from "./types";

    export let board: BoardState;
    export let preview: Piece | null;
    export let canvas: HTMLCanvasElement;

    let context: CanvasRenderingContext2D;
    $: context = canvas?.getContext("2d");

    $: if (canvas && context) {
        // Reset canvas
        canvas.width = $theme.size * board.cols;
        canvas.height = $theme.size * board.rows;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;

        // Draw board cells
        drawBoard(context, board, $theme);

        // Draw preview piece
        if (preview) drawPiece(context, preview, $theme, 0.25);
    }
</script>