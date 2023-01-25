import { Matrix } from '../utilities';

// Arguments passed to the worker
export interface WorkerArguments {
    rows: number,
    cols: number,
    data: number[],
    initialPiece: Piece,
    finalPiece: Piece,
}

// Game types
export type Board = Matrix<number>;

export interface Block {
    x: number,
    y: number,
}

export interface Piece {
    x: number,
    y: number,
    type: number,
    rotation: number
}

// Utility functions
export function shiftPiece(piece: Piece, dx: number, dy: number): Piece {
    return {
        ...piece,
        x: piece.x + dx,
        y: piece.y + dy,
    };
}

export function rotatePiece(piece: Piece, amount: number): Piece {
    return {
        ...piece,
        rotation: (piece.rotation + amount + 4) % 4,
    };
}