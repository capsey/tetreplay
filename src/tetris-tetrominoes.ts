import { Piece, Block } from "./tetris";

// Every piece in their starting positions
export const iPiece = new Piece([
    [new Block(3, 1), new Block(4, 1), new Block(5, 1), new Block(6, 1)],
    [new Block(5, 0), new Block(5, 1), new Block(5, 2), new Block(5, 3)],
    [new Block(3, 2), new Block(4, 2), new Block(5, 2), new Block(6, 2)],
    [new Block(4, 0), new Block(4, 1), new Block(4, 2), new Block(4, 3)],
], new Block(5, 2), 0);

export const jPiece = new Piece([
    [new Block(3, 0), new Block(3, 1), new Block(4, 1), new Block(5, 1)],
    [new Block(4, 0), new Block(4, 1), new Block(4, 2), new Block(5, 0)],
    [new Block(3, 1), new Block(4, 1), new Block(5, 1), new Block(5, 2)],
    [new Block(3, 2), new Block(4, 0), new Block(4, 1), new Block(4, 2)],
], new Block(4.5, 1.5), 1);

export const lPiece = new Piece([
    [new Block(3, 1), new Block(4, 1), new Block(5, 1), new Block(5, 0)],
    [new Block(4, 0), new Block(4, 1), new Block(4, 2), new Block(5, 2)],
    [new Block(3, 1), new Block(3, 2), new Block(4, 1), new Block(5, 1)],
    [new Block(3, 0), new Block(4, 0), new Block(4, 1), new Block(4, 2)],
], new Block(4.5, 1.5), 2);

export const oPiece = new Piece([
    [new Block(4, 0), new Block(4, 1), new Block(5, 0), new Block(5, 1)],
    [new Block(4, 0), new Block(4, 1), new Block(5, 0), new Block(5, 1)],
    [new Block(4, 0), new Block(4, 1), new Block(5, 0), new Block(5, 1)],
    [new Block(4, 0), new Block(4, 1), new Block(5, 0), new Block(5, 1)],
], new Block(5, 1), 3);

export const sPiece = new Piece([
    [new Block(3, 1), new Block(4, 1), new Block(4, 0), new Block(5, 0)],
    [new Block(4, 0), new Block(4, 1), new Block(5, 1), new Block(5, 2)],
    [new Block(3, 2), new Block(4, 2), new Block(4, 1), new Block(5, 1)],
    [new Block(3, 0), new Block(3, 1), new Block(4, 1), new Block(4, 2)],
], new Block(4.5, 1.5), 4);

export const zPiece = new Piece([
    [new Block(3, 1), new Block(4, 1), new Block(4, 0), new Block(5, 1)],
    [new Block(4, 0), new Block(4, 1), new Block(4, 2), new Block(5, 1)],
    [new Block(3, 1), new Block(4, 1), new Block(4, 2), new Block(5, 1)],
    [new Block(3, 1), new Block(4, 0), new Block(4, 1), new Block(4, 2)],
], new Block(4.5, 1.5), 5);

export const tPiece = new Piece([
    [new Block(3, 0), new Block(4, 0), new Block(4, 1), new Block(5, 1)],
    [new Block(4, 2), new Block(4, 1), new Block(5, 1), new Block(5, 0)],
    [new Block(3, 1), new Block(4, 1), new Block(4, 2), new Block(5, 2)],
    [new Block(3, 2), new Block(3, 1), new Block(4, 1), new Block(4, 0)],
], new Block(4.5, 1.5), 6);

export const pieces = [iPiece, jPiece, lPiece, oPiece, sPiece, zPiece, tPiece];