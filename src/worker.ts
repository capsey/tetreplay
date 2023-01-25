import { findInputs } from './algorithms';
import { WorkerArguments } from './game/types';
import { Matrix } from './utilities';

onmessage = ({ data: { rows, cols, data, initialPiece, finalPiece } }: MessageEvent<WorkerArguments>) => {
    // Recreate the board
    const board = new Matrix(rows, cols, (x, y) => data[cols * y + x]);

    // Calculate input combination (CPU intensive)
    const inputs = findInputs(initialPiece, finalPiece, board);

    // Send results back
    postMessage(inputs);
}
