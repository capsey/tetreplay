import * as paper from 'paper';
import { Queue } from 'typescript-collections';

import { Matrix } from './utilities';
import { BoardRenderer, PieceRenderer, PlayerRenderer } from './view/renderers';
import { WorkerArguments, Piece, rotatePiece } from './game/types';
import { Input, collides } from './game/rules';
import { getBlocks, getCenter, getSpawnPosition, pieceColors, pieceNames } from './game/pieces';

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
const canvas = document.getElementById('game-board') as HTMLCanvasElement;

canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

paper.setup(canvas);

// Create board renderer
const boardLayer = new paper.Layer();
const boardRenderer = new BoardRenderer(boardLayer, rows, cols, cellSize);

// Create worker
const worker = new Worker(new URL('./worker.ts', import.meta.url));

worker.onmessage = ({ data }: MessageEvent<Input[]>) => {
    // If no combination found, cancel
    if (data === null) {
        // Reset the canvas
        animationPlaying = false;
        boardContainer.style.cursor = 'pointer';

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
let collisionMap: Piece[] = [];
updateCollisionMap();

function updateCollisionMap() {
    // Update collision map
    collisionMap = [];

    // Check every position on the board
    for (let x = -2; x < cols; x++) {
        for (let y = -1; y < rows; y++) {
            const shiftedPiece: Piece = { ...selectedPiece, x, y };

            // Add if can be placed there
            if (!collides(getBlocks(shiftedPiece), board)) {
                collisionMap.push(shiftedPiece);
            }
        }
    }
}

function placePieceIntoBoard(piece: Piece) {
    const blocks = getBlocks(piece);

    // Place piece into the board
    board = board.modify(setter => {
        blocks.forEach(block => {
            const type = piece.type;

            setter(block.x, block.y, type);
            boardRenderer.setBlock(block.x, block.y, type);
        })
    });

    // Clear lines if needed
    if (clearLines) {
        // Find lines affected by piece placement
        const start = blocks.map(block => block.y).minBy(n => n);
        const end = blocks.map(block => block.y).maxBy(n => n);

        // Check these lines
        for (let j = start; j <= end; j++) {
            // Is there any empty cells in the line?
            let clear = true;

            for (let i = 0; i < board.cols; i++) {
                if (board.getItem(i, j) < 0) {
                    clear = false;
                    break;
                }
            }

            if (!clear) continue;

            // If so, move all above rows one row downwards
            board = board.modify(setter => {
                for (let k = j - 1; k >= 0; k--) {
                    for (let l = 0; l < board.cols; l++) {
                        const type = board.getItem(l, k);

                        setter(l, k + 1, type);
                        boardRenderer.setBlock(l, k + 1, type);
                    }
                }
            });
        }
    }

    // Update collision map to account for board changes
    updateCollisionMap();
}

// Toolbar
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
        updateCollisionMap();
    });
});

// Settings
let clearLines = true;
let onlyPossible = true;

const settingsForm = document.getElementById('settings') as HTMLFormElement;

settingsForm.reset();
settingsForm.onchange = (event) => {
    const target = event.target as HTMLInputElement;

    // Update corresponding settings
    if (target.name === 'clear-lines') {
        clearLines = target.checked;
    } else if (target.name === 'only-possible') {
        onlyPossible = target.checked;
    }
};

// Display input combination
const playerLayer = new paper.Layer();
const playerRenderer = new PlayerRenderer(playerLayer, 0, board, cellSize);

playerRenderer.visible = false;

// Input animation
let animationPlaying = false;
const inputsQueue = new Queue<Input>();

function inputQueueTick() {
    // Retrieve input to perform if any
    if (inputsQueue.isEmpty()) return;

    const input = inputsQueue.dequeue();

    // Move the piece according to the input
    playerRenderer.applyInput(input, board, cellSize);

    if (input === Input.HARD_DROP) {
        // If input is locking, lock the piece
        placePieceIntoBoard(playerRenderer.piece);

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
        boardContainer.style.cursor = 'pointer';

        // Update preview piece position
        updatePiecePreview();
    }
}

// Piece insertion preview
const previewLayer = new paper.Layer();
const previewRenderer = new PieceRenderer(previewLayer, selectedPiece, cellSize, 0.5);

previewRenderer.visible = false;

function updatePiecePreview() {
    // Finding closest valid placement
    const placement = findSelectedPiecePlacement();

    // If found, display on the board
    if (placement) {
        previewRenderer.setPiece(placement, cellSize);
    }

    if (placement && !animationPlaying) {
        previewRenderer.visible = true;
        boardContainer.style.cursor = 'pointer';
    } else {
        previewRenderer.visible = false;
        boardContainer.style.cursor = 'inherit';
    }
}

// Input handling
let mouseX = 5;
let mouseY = 0;

function findSelectedPiecePlacement(): Piece | null {
    // Find the closest to the mouse
    return collisionMap
        .map(piece => {
            let { x, y } = getCenter(piece);
            x -= mouseX;
            y -= mouseY;

            // Calculate Euclidean distance
            return { piece, distance: x * x + y * y };
        })
        .filter(({ distance }) => distance < 5 * 5)
        .minBy(({ distance }) => distance)?.piece;
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
    if (event.key === 'e' || event.key === 'q' || event.key === 'w') {
        // Prevent default behavious, e.g. scrolling or typing
        event.preventDefault();

        // Get rotation direction
        const direction = event.key === 'e' ? 1 : event.key === 'q' ? -1 : 2;

        // Rotate the piece
        selectedPiece = rotatePiece(selectedPiece, direction);
        updateCollisionMap();

        // Update preview piece position
        updatePiecePreview();
    } else if (/^[1-7]$/.test(event.key)) {
        // Parse number key into piece name
        const index = parseInt(event.key) - 1;
        const piece = pieceNames[index];

        // Set selected piece
        const button = pieceSelectionForm.querySelector(`input[value="${piece}"]`) as HTMLInputElement;
        button.click();

        // Update preview piece position
        updatePiecePreview();
    }
};

boardContainer.onclick = () => {
    if (animationPlaying) return;

    const placement = findSelectedPiecePlacement();

    // If placement exists
    if (placement) {
        // If should only place possible piece positions
        if (onlyPossible) {
            // Set loading cursor while algorithm is running
            boardContainer.style.cursor = 'wait';

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
        } else {
            // Otherwise, just place piece into the board
            placePieceIntoBoard(placement);
        }
    }
};