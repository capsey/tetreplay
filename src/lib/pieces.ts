import type { Piece, Block } from './types';

function createBlock(x: number, y: number): Block {
    return { x, y };
}

const pieces = [
    [ // I piece
        [createBlock(0, 0), createBlock(1, 0), createBlock(2, 0), createBlock(3, 0)],
        [createBlock(2, -1), createBlock(2, 0), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(3, 1)],
        [createBlock(1, -1), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ],
    [ // J piece
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 0)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ],
    [ // L piece
        [createBlock(0, 1), createBlock(1, 1), createBlock(2, 1), createBlock(2, 0)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 2)],
        [createBlock(0, 1), createBlock(0, 2), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(0, 0), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ],
    [ // O piece
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 0), createBlock(1, 1)],
    ],
    [ // S piece
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 0), createBlock(2, 0)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(2, 1), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(1, 2), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(0, 0), createBlock(0, 1), createBlock(1, 1), createBlock(1, 2)],
    ],
    [ // T piece
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 0), createBlock(2, 1)],
        [createBlock(1, 0), createBlock(1, 1), createBlock(1, 2), createBlock(2, 1)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 2), createBlock(2, 1)],
        [createBlock(0, 1), createBlock(1, 0), createBlock(1, 1), createBlock(1, 2)],
    ],
    [ // S piece
        [createBlock(0, 0), createBlock(1, 0), createBlock(1, 1), createBlock(2, 1)],
        [createBlock(1, 2), createBlock(1, 1), createBlock(2, 1), createBlock(2, 0)],
        [createBlock(0, 1), createBlock(1, 1), createBlock(1, 2), createBlock(2, 2)],
        [createBlock(0, 2), createBlock(0, 1), createBlock(1, 1), createBlock(1, 0)],
    ]];

const pieceCenters = pieces.map(rotations => {
    return rotations.map(blocks => {
        const x = blocks.reduce((acc, curr) => acc + curr.x, 0) / blocks.length;
        const y = blocks.reduce((acc, curr) => acc + curr.y, 0) / blocks.length;

        return { x: x + 0.5, y: y + 0.5 };
    });
});

export function getSpawnPosition(type: number): Piece {
    return {
        x: type !== 3 ? 3 : 4, // Only O piece spawns at 4
        y: type !== 0 ? 0 : 1, // Only I piece spawns at 1
        type,
        rotation: 0,
    };
}

export function getBlocks(piece: Piece): Block[] {
    const spawnBlocks = pieces[piece.type][piece.rotation];

    return spawnBlocks.map(block => {
        return {
            x: block.x + piece.x,
            y: block.y + piece.y,
        }
    });
}

export function getCenter(piece: Piece) {
    const spawnCenter = pieceCenters[piece.type][piece.rotation];

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

export const pieceNames = ['i-piece', 'j-piece', 'l-piece', 'o-piece', 's-piece', 't-piece', 'z-piece'];