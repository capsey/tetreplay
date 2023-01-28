// Types related to the game logic
export type Block = {
    x: number,
    y: number,
};

export type Piece = {
    x: number,
    y: number,
    type: number,
    rotation: number
};

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