import { writable, get } from "svelte/store";
import { getBlocks } from "../pieces";
import type { Piece } from "../types";
import { Matrix } from "../utilities";

// Settings
export const shouldClearLines = writable(true);
export const onlyAllowDoable = writable(true);

// Board
const rows = 22;
const cols = 10;

let boardHistory: Matrix<number>[] = [];

export const board = (() => {
    const { subscribe, set, update } = writable(new Matrix(rows, cols, -1));

    function clearLines(board: Matrix<number>) {
        for (let i = 0; i < board.rows; i++) {
            let full = true;

            // Check if line is full
            for (let j = 0; j < board.cols; j++) {
                if (board.getItem(j, i) < 0) {
                    full = false;
                    break;
                }
            }

            if (!full) continue;

            // Move all lines above one cell down
            for (let k = i; k >= 0; k--) {
                for (let j = 0; j < board.cols; j++) {
                    const value = k > 0 ? board.getItem(j, k - 1) : -1;
                    board.setItem(j, k, value);
                }
            }
        }
    }

    function placePiece(piece: Piece) {
        update((board) => {
            // Add current board state to the top of the history
            boardHistory.push(board.copy());

            // Place all the pieces
            getBlocks(piece).forEach(({ x, y }) => board.setItem(x, y, piece.type));

            // Check for line clears if needed
            if (get(shouldClearLines)) clearLines(board);

            return board;
        });
    }

    function undo() {
        const board = boardHistory.pop();
        if (board) set(board);
    }

    function clear() {
        boardHistory = [];
        set(new Matrix(rows, cols, -1));
    }

    return {
        subscribe,
        placePiece,
        undo,
        clear,
    };
})();