import * as paper from 'paper';

import { minBy, Matrix } from './utilities';
import { BoardRenderer, PieceRenderer, PlayerRenderer } from './tetris-renderer';
import { Piece, rotatePiece } from './tetris-types';
import { Input, collides } from './tetris-rules';
import { Queue } from 'typescript-collections';
import { WorkerArguments } from './worker';
import { getBlocks, getCenter, getSpawnPosition, pieceColors, pieceNames } from './tetris-tetrominoes';

// Game paramenters
const rows = 22;
const cols = 10;
const cellSize = 24;

document.documentElement.style.setProperty('--board-rows', rows.toString());
document.documentElement.style.setProperty('--board-cols', cols.toString());
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
    // If no combination found, cancel
    if (data === null) {
        // Reset the canvas
        animationPlaying = false;
        canvas.style.cursor = 'pointer';

        // Update preview piece position
        updatePiecePreview();
        return;
    }

    // Set player renderer
    playerRenderer.setPiece(selectedPiece, board, cellSize);
    playerRenderer.visible = true;

    // Add inputs to the queue and start animation
    data.forEach(x => inputsQueue.enqueue(x));
    setTimeout(inputQueueTick, 100);
};

// Selected piece
let selectedPiece = getSpawnPosition(0);

const pieceSelectionForm = document.getElementById('toolbar') as HTMLFormElement;
const pieceSelectionButtons = pieceSelectionForm.querySelectorAll('input[name="piece"]') as NodeListOf<HTMLInputElement>;

pieceSelectionForm.reset();
pieceSelectionButtons.forEach(button => {
    // Get the type by name
    const type = pieceNames.indexOf(button.value);

    // Set styling properties
    button.style.setProperty('--icon', `url("icons/${button.value}.svg")`);
    button.style.setProperty('--color', pieceColors[type]);

    // Set new selected piece when selected
    button.addEventListener('change', () => {
        selectedPiece = getSpawnPosition(type);
    });
});

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

        // Hide renderer
        playerRenderer.visible = false;
    }

    if (!inputsQueue.isEmpty()) {
        // Request another tick if there are more
        const delay = input === Input.HARD_DROP ? 500 :
            input === Input.SOFT_DROP ? 50 :
                input === Input.ROTATE_180 ? 400 :
                    input == Input.ROTATE_CLOCKWISE ? 400 :
                        input == Input.ROTATE_COUNTER_CLOCKWISE ? 400 : 100

        setTimeout(inputQueueTick, delay);
    } else {
        // Reset the canvas
        animationPlaying = false;
        canvas.style.cursor = 'pointer';

        // Update preview piece position
        updatePiecePreview();
    }
}

// Piece insertion preview
let previewLayer = new paper.Layer();
let previewRenderer = new PieceRenderer(previewLayer, selectedPiece, cellSize, 0.5);

previewRenderer.visible = false;

function updatePiecePreview() {
    // Finding closest valid placement
    const placement = findSelectedPiecePlacement();

    // If found, display on the board
    if (placement) {
        previewRenderer.setPiece(placement, cellSize);
    }

    previewRenderer.visible = placement !== null && !animationPlaying;
}

// Input handling
let mouseX = 5;
let mouseY = 0;

function findSelectedPiecePlacement(): Piece | null {
    const center = getCenter(selectedPiece);
    const sx = selectedPiece.x + Math.round(mouseX - center.x);
    const sy = selectedPiece.y + Math.round(mouseY - center.y);

    let potentialPieces = [];

    // Check positions in 4x4 square arount the mouse
    for (let dx = -4; dx <= 4; dx++) {
        for (let dy = -4; dy <= 4; dy++) {
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

    // From all valid ones, find the closest to the mouse
    return minBy(potentialPieces, piece => {
        let { x, y } = getCenter(piece);
        x -= mouseX;
        y -= mouseY;

        return x * x + y * y;
    });
}

const boardContainer = document.getElementById('board-container') as HTMLDivElement;

boardContainer.onmousemove = (event) => {
    // Calculating mouse position in board coordinates
    const bounds = canvas.getBoundingClientRect();
    mouseX = (event.x - bounds.left) / cellSize;
    mouseY = (event.y - bounds.top) / cellSize;

    // Update preview piece position
    updatePiecePreview();
};

boardContainer.onmouseout = (_) => {
    // Hide preview piece while not hovering over board
    previewRenderer.visible = false;
}

document.onkeydown = (event) => {
    if (event.key === 'r') {
        // Prevent default behavious, e.g. scrolling or typing
        event.preventDefault();

        // Rotate the piece clockwise
        selectedPiece = rotatePiece(selectedPiece, 1);

        // Update preview piece position
        updatePiecePreview();
    }
};

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