import * as paper from 'paper';

import { random, Matrix, minBy } from './utilities';
import { Board } from './tetris-board'
import { pieces } from './tetris-tetrominoes';
import { BoardRenderer, PieceRenderer } from './tetris-renderer';
import { modernRules } from './tetris-rules';
import { Piece } from './tetris';

// Constants
const rows = 22;
const cols = 10;
const cellWidth = 24;

document.documentElement.style.setProperty('--board-rows', rows.toString());
document.documentElement.style.setProperty('--board-cols', cols.toString());
document.documentElement.style.setProperty('--cell-width', cellWidth + 'px');

// Initialize the board and add random blocks (DEBUG)
let rules = modernRules;
let board: Board = new Matrix<number>(rows, cols, undefined, (x, y) => {
    return random.chance(0.1) ? random.range(1, 7) : 0
});

// Create board renderer
let canvas = document.getElementById('game-board') as HTMLCanvasElement;

canvas.width = cols * cellWidth;
canvas.height = rows * cellWidth;

paper.setup(canvas);

// Create board renderer
let boardLayer = new paper.Layer();
let boardRenderer = new BoardRenderer(boardLayer, board, cellWidth);

// Create ghost piece
let ghostLayer = new paper.Layer();
let ghostPiece = random.choose(pieces);
let ghostRenderer = new PieceRenderer(ghostLayer, ghostPiece, cellWidth);

ghostRenderer.opacity = 0.5;

// Placing logic
let mouseX = 5;
let mouseY = 0;

function findClosestPlacement(piece: Piece): Piece | null {
    let potentialPieces = [];

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            const piece = ghostPiece.move(mouseX + dx, mouseY + dy);

            if (!rules.collides(piece, board)) {
                potentialPieces.push(piece);
            }
        }
    }

    return minBy(potentialPieces, piece => {
        const dx = piece.center.x - mouseX;
        const dy = piece.center.y - mouseY;
        return dx * dx + dy * dy;
    });
}

canvas.onmousemove = (event) => {
    // Calculating mouse position in board coordinates
    const bounds = canvas.getBoundingClientRect();
    mouseX = (event.x - bounds.left) / cellWidth;
    mouseY = (event.y - bounds.top) / cellWidth;

    // Finding closest valid placement
    const finalPiece = findClosestPlacement(ghostPiece);

    // If found, display on the board
    if (finalPiece) {
        ghostPiece = finalPiece;
        ghostRenderer.setPiece(ghostPiece, cellWidth);
    }
};

document.onkeydown = (event) => {
    if (event.key === 'r') {
        // Prevent default behavious, e.g. scrolling or typing
        event.preventDefault();

        // Rotate the piece clockwise
        ghostPiece = ghostPiece.rotate(1);

        // Finding closest valid placement
        const finalPiece = findClosestPlacement(ghostPiece);

        // If found, display on the board
        if (finalPiece) {
            ghostPiece = finalPiece;
            ghostRenderer.setPiece(ghostPiece, cellWidth);
        }
    }
};

canvas.onmousedown = (_) => {
    // Check whether can place the piece
    if (!rules.collides(ghostPiece, board)) {
        // Place all blocks of the piece into the board
        board = board.modify(setter => {
            ghostPiece.blocks.forEach(block => {
                setter(block.x, block.y, ghostPiece.color + 1);
                boardRenderer.setBlock(block.x, block.y, ghostPiece.color + 1);
            });
        });

        // Generate new piece
        ghostPiece = random.choose(pieces);
    }
};
