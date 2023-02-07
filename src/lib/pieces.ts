import type { Block, Piece, PieceType } from "./types";
import "./utilities";

function createBlock(x: number, y: number): Block {
    return { x, y };
}

const pieces = new Map<PieceType, Block[][]>([
    ["i-piece", [
        [createBlock(0, 0), createBlock(1, 0), createBlock(2, 0), createBlock(3, 0)],
        [createBlock(2, -1), createBlock(2, 0), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(3, 1)],
        [createBlock(1, -1), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ]],
    ["j-piece", [
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 0)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ]],
    ["l-piece", [
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(2, 0)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 2)],
        [createBlock(0, 1), createBlock(0, 2), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(0, 0), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ]],
    ["o-piece", [
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
    ]],
    ["s-piece", [
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 0), createBlock(2, 0)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(1, 2), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 1), createBlock(1, 2)],
    ]],
    ["t-piece", [
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 0), createBlock(2, 1)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 1)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 2), createBlock(2, 1)],
        [createBlock(0, 1), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ]],
    ["z-piece", [
        [createBlock(0, 0), createBlock(1, 0), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(1, 2), createBlock(1, 1), createBlock(2, 1), createBlock(2, 0)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 2), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(0, 1), createBlock(1, 1), createBlock(1, 0)],
    ]]
]);

const pieceCenters = pieces.remap((rotations) => {
    return rotations.map(blocks => {
        const x = blocks.reduce((acc, curr) => acc + curr.x, 0) / blocks.length;
        const y = blocks.reduce((acc, curr) => acc + curr.y, 0) / blocks.length;

        return { x: x + 0.5, y: y + 0.5 } as Block;
    });
});

export function getSpawnPosition(color: PieceType): Piece {
    return {
        x: color !== "o-piece" ? 3 : 4, // Only O piece spawns at 4
        y: color !== "i-piece" ? 0 : 1, // Only I piece spawns at 1
        color,
        rotation: 0,
    };
}

export function getBlocks(piece: Piece): Block[] {
    const blocks = pieces.get(piece.color)[piece.rotation];

    return blocks.map(block => {
        return {
            x: block.x + piece.x,
            y: block.y + piece.y,
        }
    });
}

export function getCenter(piece: Piece) {
    const spawnCenter = pieceCenters.get(piece.color)[piece.rotation];

    return {
        x: spawnCenter.x + piece.x,
        y: spawnCenter.y + piece.y,
    };
}

export function pieceEquals(a: Piece, b: Piece) {
    const compare = (a: Block, b: Block) => a.x !== b.x ? a.x - b.x : a.y - b.y;

    const as = getBlocks(a).sort(compare);
    const bs = getBlocks(b).sort(compare);

    return as.every((x, i) => x.x === bs[i].x && x.y === bs[i].y);
}
