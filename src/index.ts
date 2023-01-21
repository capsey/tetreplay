import * as paper from 'paper';

import { random, minBy, Matrix } from './utilities';
import { BoardRenderer, PieceRenderer, PlayerRenderer } from './tetris-renderer';
import { Piece, rotatePiece, shiftPiece } from './tetris-types';
import { Input, applyInput, collides } from './tetris-rules';
import { Queue } from 'typescript-collections';
import { WorkerArguments } from './worker';
import { getBlocks, getCenter, getSpawnPosition } from './tetris-tetrominoes';

// Game paramenters
const rows = 22;
const cols = 10;
const cellSize = 24;

document.documentElement.style.setProperty('--cell-width', cellSize + 'px');

// Create game board
let board = new Matrix<number>(rows, cols, () => -1);

// Setup Paper.js
let canvas = document.getElementById('game-board') as HTMLCanvasElement;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

paper.setup(canvas);

// Create board renderer
let boardLayer = new paper.Layer();
let boardRenderer = new BoardRenderer(boardLayer, rows, cols, cellSize);

// Create worker
const worker = new Worker(new URL('./worker.ts', import.meta.url));

worker.onmessage = ({ data }: MessageEvent<Input[]>) => {
    // Reset cursor
    // canvas.style.cursor = 'not-allowed';

    // If no combination found, cancel
    if (data === null) {
        animationPlaying = false;
        canvas.style.cursor = 'pointer';
        return;
    }

    // Set player renderer
    playerRenderer.setPiece(selectedPiece, board, cellSize);
    playerRenderer.visible = true;

    // Add inputs to the queue and start animation
    data.forEach(x => inputsQueue.enqueue(x));
    setTimeout(inputQueueTick, 100);
};

// Piece generation
let selectedPiece = getSpawnPosition(0);

function selectPiece(pieceType: number) {
    // Generate new piece
    selectedPiece = getSpawnPosition(pieceType);
}

// Display input combination
let playerLayer = new paper.Layer();
let playerRenderer = new PlayerRenderer(playerLayer, 0, board, cellSize);

playerRenderer.visible = false;

// Input animation
let animationPlaying = false;
let inputsQueue = new Queue<Input>();

function inputQueueTick() {
    // Retrieve input to perform if any
    if (inputsQueue.isEmpty()) return;

    const input = inputsQueue.dequeue();

    // Move the piece according to the input
    playerRenderer.applyInput(input, board, cellSize);

    // If input is locking, lock the piece
    if (input === Input.HARD_DROP) {
        // Place piece into the board
        board = board.modify(setter => {
            getBlocks(playerRenderer.piece).forEach(block => {
                setter(block.x, block.y, playerRenderer.piece.type);
                boardRenderer.setBlock(block.x, block.y, playerRenderer.piece.type)
            })
        });

        // Generate random piece
        selectPiece(random.range(0, 6));

        // Hide renderer
        playerRenderer.visible = false;
    }

    // Request another tick if there are more
    if (!inputsQueue.isEmpty()) {
        const delay = input === Input.HARD_DROP ? 500 :
            input === Input.SOFT_DROP ? 50 :
                input === Input.ROTATE_180 ? 400 :
                    input == Input.ROTATE_CLOCKWISE ? 400 :
                        input == Input.ROTATE_COUNTER_CLOCKWISE ? 400 : 100

        setTimeout(inputQueueTick, delay);
    } else {
        animationPlaying = false;
        canvas.style.cursor = 'pointer';
    }
}

// Piece insertion preview
let previewLayer = new paper.Layer();
let previewRenderer = new PieceRenderer(previewLayer, selectedPiece, cellSize);

previewRenderer.visible = false;

// Input handling
let mouseX = 5;
let mouseY = 0;

function findSelectedPiecePlacement(): Piece | null {
    const center = getCenter(selectedPiece);
    const sx = selectedPiece.x + Math.round(mouseX - center.x);
    const sy = selectedPiece.y + Math.round(mouseY - center.y);

    let potentialPieces = [];

    for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
            const shiftedPiece: Piece = {
                ...selectedPiece,
                x: sx + dx,
                y: sy + dy,
            };

            if (!collides(getBlocks(shiftedPiece), board)) {
                potentialPieces.push(shiftedPiece);
            }
        }
    }

    return minBy(potentialPieces, piece => {
        let { x, y } = getCenter(piece);
        x -= mouseX;
        y -= mouseY;

        return x * x + y * y;
    });
}

canvas.onmousemove = (event) => {
    // Calculating mouse position in board coordinates
    const bounds = canvas.getBoundingClientRect();
    mouseX = (event.x - bounds.left) / cellSize;
    mouseY = (event.y - bounds.top) / cellSize;

    // Finding closest valid placement
    const placement = findSelectedPiecePlacement();

    // If found, display on the board
    if (placement) {
        previewRenderer.setPiece(placement, cellSize);
    }

    previewRenderer.visible = placement !== null && !animationPlaying;
};

window.onkeydown = (event) => {
    if (event.key === 'r') {
        // Prevent default behavious, e.g. scrolling or typing
        event.preventDefault();

        // Rotate the piece clockwise
        selectedPiece = rotatePiece(selectedPiece, 1);

        // Finding closest valid placement
        const placement = findSelectedPiecePlacement();

        // If found, display on the board
        if (placement) {
            previewRenderer.setPiece(placement, cellSize);
        }

        previewRenderer.visible = placement !== null && !animationPlaying;
    }
};

canvas.onmouseout = () => {
    // Hide preview piece while not hovering over board
    previewRenderer.visible = false;
}

canvas.onclick = () => {
    if (animationPlaying) return;

    const placement = findSelectedPiecePlacement();

    // If found placement
    if (placement) {
        // Set loading cursor while algorithm is running
        canvas.style.cursor = 'wait';

        // Remove piece preview
        animationPlaying = true;
        previewRenderer.visible = false;

        // Start search algorithm on worker thread
        const args: WorkerArguments = {
            rows: board.rows,
            cols: board.cols,
            data: board.data,
            initialPiece: selectedPiece,
            finalPiece: placement
        };

        worker.postMessage(args);
    }
};