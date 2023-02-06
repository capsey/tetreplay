import { writable, get } from "svelte/store";
import { getBlocks } from "../pieces";
import { BoardState, type Block, type Piece } from "../types";
import { Matrix } from "../utilities";
import { event } from "./utilities";

// Settings
export const shouldClearLines = writable(true);
export const onlyAllowDoable = writable(true);

// Events
type ColoredBlock = Block & { color: number };
type LineClearEvent = { blocks: ColoredBlock[], points: number };

export const lastClearedLines = event<LineClearEvent>({ blocks: [], points: 0 });

// Board
const rows = 22;
const cols = 10;

export const board = (() => {
    const initial = new BoardState(new Matrix(rows, cols, -1));
    const { subscribe, set, update } = writable(initial);

    function clearLines(data: Matrix<number>) {
        let count = 0;
        let cleared: ColoredBlock[] = [];

        for (let i = 0; i < data.rows; i++) {
            let full = true;

            // Check if line is full
            for (let j = 0; j < data.cols; j++) {
                if (data.get(j, i) < 0) {
                    full = false;
                    break;
                }
            }

            if (!full) continue;

            // Add cleared blocks
            for (let j = 0; j < data.cols; j++) {
                cleared.push({ x: j, y: i, color: data.get(j, i) });
            }

            // Move all lines above one cell down
            for (let k = i; k >= 0; k--) {
                for (let j = 0; j < data.cols; j++) {
                    const value = k > 0 ? data.get(j, k - 1) : -1;
                    data.set(j, k, value);
                }
            }

            count += 1;
        }

        if (count > 0) lastClearedLines.emit({ blocks: cleared, points: count });
    }

    function placePiece(piece: Piece) {
        update((board) => board.update(data => {
            // Place all the pieces
            getBlocks(piece).forEach(({ x, y }) => data.set(x, y, piece.type));

            // Check for line clears if needed
            if (get(shouldClearLines)) clearLines(data);
        }));
    }

    function clear() {
        set(initial);
    }

    return {
        subscribe,
        placePiece,
        clear,
    };
})();