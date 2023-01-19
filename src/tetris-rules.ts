import { Piece } from './tetris';
import { Board } from './tetris-board';

export interface RuleSet {
    shiftRight: (piece: Piece) => Piece;
    shiftLeft: (piece: Piece) => Piece;
    softDrop: (piece: Piece) => Piece;
    rotatePiece: (piece: Piece, board: Board, direction: number) => Piece;
    collides: (piece: Piece, board: Board) => boolean;
}

export const modernRules: RuleSet = {
    shiftRight: function (piece: Piece): Piece {
        return piece.shift(1, 0);
    },
    shiftLeft: function (piece: Piece): Piece {
        return piece.shift(-1, 0);
    },
    softDrop: function (piece: Piece): Piece {
        return piece.shift(0, 1);
    },
    rotatePiece: function (piece: Piece, board: Board, direction: number): Piece {
        // TODO: Add SRS
        return piece.rotate(direction);
    },
    collides: function (piece: Piece, board: Board): boolean {
        return !piece.blocks.every((value, index) => {
            if (value.x >= 0 && value.x < board.cols && value.y >= 0 && value.y < board.rows) {
                return board.getItem(value.x, value.y) === 0;
            }

            return false;
        });
    }
};