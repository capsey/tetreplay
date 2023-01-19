import * as paper from 'paper';

import { random, Matrix, minBy } from './utilities';
import { Board } from './tetris-board'
import { pieces } from './tetris-tetrominoes';
import { BoardRenderer, PieceRenderer } from './tetris-renderer';
import { modernRules } from './tetris-rules';

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
canvas.onmousemove = (event) => {
    // Calculating mouse position in board coordinates
    const bounds = canvas.getBoundingClientRect();
    const x = (event.x - bounds.left) / cellWidth;
    const y = (event.y - bounds.top) / cellWidth;

    // Finding closest location in 3x3 area
    let potentialPieces = [];

    for (let sx = -1; sx <= 1; sx++) {
        for (let sy = -1; sy <= 1; sy++) {
            const piece = ghostPiece.move(x + sx, y + sy);

            if (!rules.collides(piece, board)) {
                potentialPieces.push(piece);
            }
        }
    }

    const finalPiece = minBy(potentialPieces, piece => {
        const dx = piece.center.x - x;
        const dy = piece.center.y - y;
        return dx * dx + dy * dy;
    });

    if (finalPiece) {
        ghostPiece = finalPiece;
        ghostRenderer.setPiece(ghostPiece, cellWidth);
    }
};

canvas.onmousedown = (event) => {
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