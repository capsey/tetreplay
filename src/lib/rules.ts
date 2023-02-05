import { getBlocks } from "./pieces";
import { type Block, type Piece, shiftPiece, rotatePiece } from "./types";

export enum Input {
    SHIFT_RIGHT,
    SHIFT_LEFT,
    SOFT_DROP,
    HARD_DROP,
    ROTATE_CLOCKWISE,
    ROTATE_COUNTER_CLOCKWISE,
    ROTATE_180
}

type Predicate = (x: number, y: number) => boolean;

export function collides(blocks: Block[], isEmpty: Predicate): boolean {
    return !blocks.every(block => isEmpty(block.x, block.y));
}

export function applyInput(piece: Piece, isEmpty: Predicate, input: Input): Piece | null {
    switch (input) {
        case Input.SHIFT_RIGHT:
            return shiftRight(piece, isEmpty);

        case Input.SHIFT_LEFT:
            return shiftLeft(piece, isEmpty);

        case Input.SOFT_DROP:
            return softDrop(piece, isEmpty);

        case Input.HARD_DROP:
            return hardDrop(piece, isEmpty);

        case Input.ROTATE_CLOCKWISE:
            return rotate(piece, isEmpty, 1);

        case Input.ROTATE_COUNTER_CLOCKWISE:
            return rotate(piece, isEmpty, -1);

        case Input.ROTATE_180:
            return rotate(piece, isEmpty, 2);
    }
}

export function shiftRight(piece: Piece, isEmpty: Predicate): Piece | null {
    const newPiece = shiftPiece(piece, 1, 0);
    return collides(getBlocks(newPiece), isEmpty) ? null : newPiece;
}

export function shiftLeft(piece: Piece, isEmpty: Predicate): Piece | null {
    const newPiece = shiftPiece(piece, -1, 0);
    return collides(getBlocks(newPiece), isEmpty) ? null : newPiece;
}

export function softDrop(piece: Piece, isEmpty: Predicate): Piece | null {
    const newPiece = shiftPiece(piece, 0, 1);
    return collides(getBlocks(newPiece), isEmpty) ? null : newPiece;
}

export function hardDrop(piece: Piece, isEmpty: Predicate): Piece {
    while (true) {
        const newPiece = softDrop(piece, isEmpty);

        if (newPiece) {
            piece = newPiece;
        } else {
            return piece;
        }
    }
}

export function rotate(piece: Piece, isEmpty: Predicate, direction: number): Piece | null {
    // TODO: Add SRS
    const newPiece = rotatePiece(piece, direction);
    return collides(getBlocks(newPiece), isEmpty) ? null : newPiece;
}