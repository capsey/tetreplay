import { findInputs } from './tetris-algorithm';
import { Piece } from './tetris-types';
import { Matrix } from './utilities';

export interface WorkerArguments {
    rows: number,
    cols: number,
    data: number[],
    initialPiece: Piece,
    finalPiece: Piece,
}

onmessage = ({ data: { rows, cols, data, initialPiece, finalPiece } }: MessageEvent<WorkerArguments>) => {
    // Recreate the board
    const board = new Matrix(rows, cols, (x, y) => data[cols * y + x]);

    // Calculate input combination (CPU intensive)
    const inputs = findInputs(initialPiece, finalPiece, board);

    // Send results back
    postMessage(inputs);
}
