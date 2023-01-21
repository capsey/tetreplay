import { getBlocks } from './tetris-tetrominoes';
import { Block, Board, Piece, shiftPiece, rotatePiece } from './tetris-types';

export enum Input {
    SHIFT_RIGHT,
    SHIFT_LEFT,
    SOFT_DROP,
    HARD_DROP,
    ROTATE_CLOCKWISE,
    ROTATE_COUNTER_CLOCKWISE,
    ROTATE_180
}

export function collides(blocks: Block[], board: Board): boolean {
    return !blocks.every(block => {
        if (block.x >= 0 && block.x < board.cols && block.y >= 0 && block.y < board.rows) {
            return board.getItem(block.x, block.y) < 0;
        }

        return false;
    });
}

export function applyInput(piece: Piece, board: Board, input: Input): Piece | null {
    switch (input) {
        case Input.SHIFT_RIGHT:
            return shiftRight(piece, board);

        case Input.SHIFT_LEFT:
            return shiftLeft(piece, board);

        case Input.SOFT_DROP:
            return softDrop(piece, board);

        case Input.HARD_DROP:
            return hardDrop(piece, board);

        case Input.ROTATE_CLOCKWISE:
            return rotate(piece, board, 1);

        case Input.ROTATE_COUNTER_CLOCKWISE:
            return rotate(piece, board, -1);

        case Input.ROTATE_180:
            return rotate(piece, board, 2);
    }
}

export function shiftRight(piece: Piece, board: Board): Piece | null {
    const newPiece = shiftPiece(piece, 1, 0);
    return collides(getBlocks(newPiece), board) ? null : newPiece;
}

export function shiftLeft(piece: Piece, board: Board): Piece | null {
    const newPiece = shiftPiece(piece, -1, 0);
    return collides(getBlocks(newPiece), board) ? null : newPiece;
}

export function softDrop(piece: Piece, board: Board): Piece | null {
    const newPiece = shiftPiece(piece, 0, 1);
    return collides(getBlocks(newPiece), board) ? null : newPiece;
}

export function hardDrop(piece: Piece, board: Board): Piece {
    while (true) {
        const newPiece = softDrop(piece, board);

        if (newPiece) {
            piece = newPiece;
        } else {
            return piece;
        }
    }
}

export function rotate(piece: Piece, board: Board, direction: number): Piece | null {
    // TODO: Add SRS
    return rotatePiece(piece, direction);
}