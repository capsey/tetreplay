import { Matrix, modulus } from './utilities';

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
        rotation: modulus(piece.rotation + amount, 4),
    };
}