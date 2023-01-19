import { Board } from './tetris-board';
import { Queue } from 'typescript-collections';
import { RuleSet } from './tetris-rules';

export class Block {
    constructor(public x: number, public y: number) { }

    move(x: number, y: number): Block {
        return new Block(this.x + x, this.y + y);
    }

    equals(other: Block) {
        return this.x === other.x && this.y === other.y;
    }
}

export class Piece {
    private rotations: Block[][];
    public center: Block;

    private currentRotation: number;
    public color: number;

    public constructor(rotations: Block[][], center: Block, color: number) {
        this.rotations = rotations;
        this.center = center;

        this.currentRotation = 0;
        this.color = color;
    }

    public get blocks(): Block[] {
        return this.rotations[this.currentRotation];
    }

    public shift(x: number, y: number): Piece {
        const rotations = this.rotations.map(blocks => blocks.map(block => block.move(x, y)));
        return new Piece(rotations, this.center.move(x, y), this.color);
    }

    public move(x: number, y: number): Piece {
        const sx = Math.round(x - this.center.x);
        const sy = Math.round(y - this.center.y);
        return this.shift(sx, sy);
    }

    public equals(other: Piece): boolean {
        if (other === this) return true;
        if (!(other instanceof Piece)) return false;
        return this.blocks.every((c, i) => c.equals(other.blocks[i])) && this.color === other.color;
    }

    public hashCode(): number {
        return this.blocks.reduce((acc, curr) => acc + curr.x + curr.y, this.color);
    }
}

enum Input {
    SHIFT_RIGHT,
    SHIFT_LEFT,
    SOFT_DROP,
    HARD_DROP,
    ROTATE_CLOCKWISE,
    ROTATE_COUNTER_CLOCKWISE,
    ROTATE_180
}

function findInputs(initialPlacement: Piece, finalPlacement: Piece, board: Board, rules: RuleSet): Input[] | null {
    // Check if the parameters are valid
    const canStart = !rules.collides(initialPlacement, board);
    const canFinish = !rules.collides(finalPlacement, board);
    const canLock = rules.collides(rules.softDrop(finalPlacement), board);

    if (!canStart || !canFinish || !canLock) {
        return null;
    }

    // If already on place, just lock right away
    if (initialPlacement.equals(finalPlacement)) {
        return [Input.HARD_DROP];
    }

    // Breadth-First Search algorithm
    const queue = new Queue<Piece>();
    const visited = new Set<Piece>();
    const inputHistory = new Map<Piece, Input>();
    const pieceHistory = new Map<Piece, Piece>();

    queue.enqueue(initialPlacement);
    visited.add(initialPlacement);

    // Helper function to add new input if it is valid and had not yet been visited
    const addNewPlacement = (newPiece: Piece, input: Input, currentPiece: Piece) => {
        if (!visited.has(newPiece) && !rules.collides(newPiece, board)) {
            queue.enqueue(newPiece);
            visited.add(newPiece);
            inputHistory.set(newPiece, input);
            pieceHistory.set(newPiece, currentPiece);
        }
    };

    // Keep checking and adding new inputs until exhausted every possibility
    while (!queue.isEmpty()) {
        const currentPiece = queue.dequeue();

        if (currentPiece.equals(finalPlacement)) {
            let current = currentPiece;
            const inputs: Input[] = [];

            // Trace back the inputs
            while (current.equals(initialPlacement)) {
                inputs.unshift(inputHistory.get(current));
                current = pieceHistory.get(current);
            }

            // Replace tailing soft drops with one hard drop
            let count = 0;

            while (inputs.length > 0 && inputs[inputs.length - 1] === Input.SOFT_DROP) {
                count++;
                inputs.pop();
            }

            if (count > 0) inputs.push(Input.HARD_DROP);

            return inputs;
        }

        // Add all possible inputs to the queue

        // NOTE: Order here is important, because the algorithm returns first valid input
        // combination it can find.
        // I'm almost sure this order ensures no finesse faults, but if anyone has concrete
        // answer on that one, feel free to correct.
        addNewPlacement(rules.shiftRight(currentPiece), Input.SHIFT_RIGHT, currentPiece);
        addNewPlacement(rules.shiftLeft(currentPiece), Input.SHIFT_LEFT, currentPiece);
        addNewPlacement(rules.softDrop(currentPiece), Input.SOFT_DROP, currentPiece);
        addNewPlacement(rules.rotatePiece(currentPiece, board, 1), Input.ROTATE_CLOCKWISE, currentPiece);
        addNewPlacement(rules.rotatePiece(currentPiece, board, -1), Input.ROTATE_COUNTER_CLOCKWISE, currentPiece);
        addNewPlacement(rules.rotatePiece(currentPiece, board, 2), Input.ROTATE_180, currentPiece);
    }

    return null;
}