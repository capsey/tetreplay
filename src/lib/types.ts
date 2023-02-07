import type { Matrix } from "./utilities";

// Types related to the game logic
export class BoardState {
    constructor(private blocks: Matrix<number>) { }

    public get rows(): number {
        return this.blocks.rows;
    }

    public get cols(): number {
        return this.blocks.cols;
    }

    public isEmpty(x: number, y: number): boolean {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows && this.blocks.get(x, y) < 0;
    }

    public forEach(callback: (x: number, y: number, value: number) => void) {
        this.blocks.forEach(callback);
    }

    public update(callback: (data: Matrix<number>) => void): BoardState {
        const blocks = this.blocks.copy();
        callback(blocks);
        return new BoardState(blocks);
    }
}

export type Piece = {
    x: number,
    y: number,
    rotation: number,
    color: PieceType,
};

export type Block = {
    x: number,
    y: number,
};

export type PieceType = (typeof pieceTypes)[number];
export const pieceTypes = ["i-piece", "j-piece", "l-piece", "o-piece", "s-piece", "t-piece", "z-piece"] as const;

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

export function getTextureIndex(piece: PieceType, offset: number): number {
    // This is needed for individual textures per block
    // for more customizable themes
    return pieceTypes.indexOf(piece) + offset;
}