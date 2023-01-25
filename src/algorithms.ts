import { Queue } from 'typescript-collections';

import { Board, Piece, shiftPiece } from './game/types';
import { Input, collides, applyInput } from './game/rules';
import { getBlocks, pieceEquals } from './game/pieces';

export function findInputs(initialPlacement: Piece, finalPlacement: Piece, board: Board): Input[] | null {
    // Check if the parameters are valid
    const canStart = !collides(getBlocks(initialPlacement), board);
    const canFinish = !collides(getBlocks(finalPlacement), board);
    const canLock = collides(getBlocks(shiftPiece(finalPlacement, 0, 1)), board);

    if (!canStart || !canFinish || !canLock) {
        return null;
    }

    // If already on place, just lock right away
    if (pieceEquals(initialPlacement, finalPlacement)) {
        return [Input.HARD_DROP];
    }

    return BFS(initialPlacement, finalPlacement, board);
}

function BFS(initialPlacement: Piece, finalPlacement: Piece, board: Board) {
    // Breadth-First Search algorithm
    const queue = new Queue<Piece>();
    const visited = new Set<string>();
    const inputHistory = new Map<string, Input>();
    const pieceHistory = new Map<string, Piece>();

    // This is needed so that Set and Map compared objects by value
    const toKey = (piece: Piece) => JSON.stringify(getBlocks(piece));

    queue.enqueue(initialPlacement);
    visited.add(toKey(initialPlacement));

    // Helper function to add new input if it is valid and had not yet been visited
    const addNewPlacement = (piece: Piece, input: Input) => {
        const newPiece = applyInput(piece, board, input);

        if (newPiece !== null && !visited.has(toKey(newPiece))) {
            queue.enqueue(newPiece);
            visited.add(toKey(newPiece));
            inputHistory.set(toKey(newPiece), input);
            pieceHistory.set(toKey(newPiece), piece);
        }
    };

    // Keep checking and adding new inputs until exhausted every possibility
    while (!queue.isEmpty()) {
        const currentPiece = queue.dequeue();

        if (pieceEquals(currentPiece, finalPlacement)) {
            let current = currentPiece;
            const inputs: Input[] = [];

            // Trace back the inputs
            while (!pieceEquals(current, initialPlacement)) {
                inputs.unshift(inputHistory.get(toKey(current)));
                current = pieceHistory.get(toKey(current));
            }

            // Replace tailing soft drops with one hard drop
            let count = 0;

            while (inputs.length > 0 && inputs[inputs.length - 1] === Input.SOFT_DROP) {
                count++;
                inputs.pop();
            }

            // Hard drop at the end to lock the piece
            inputs.push(Input.HARD_DROP);

            return inputs;
        }

        // Add all possible inputs to the queue

        // NOTE: Order here is important, because the algorithm returns first valid input
        // combination it can find.
        // I'm almost sure this order ensures no finesse faults, but if anyone has concrete
        // answer on that one, feel free to correct.
        addNewPlacement(currentPiece, Input.SHIFT_RIGHT);
        addNewPlacement(currentPiece, Input.SHIFT_LEFT);
        addNewPlacement(currentPiece, Input.SOFT_DROP);
        addNewPlacement(currentPiece, Input.ROTATE_CLOCKWISE);
        addNewPlacement(currentPiece, Input.ROTATE_COUNTER_CLOCKWISE);
        addNewPlacement(currentPiece, Input.ROTATE_180);
    }

    return null;
}