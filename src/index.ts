import * as paper from 'paper';

import * as random from './random';
import { Board } from './board'

// Constants
const rows = 22;
const cols = 10;
const cellWidth = 24;

document.documentElement.style.setProperty('--board-rows', rows.toString());
document.documentElement.style.setProperty('--board-cols', cols.toString());
document.documentElement.style.setProperty('--cell-width', cellWidth + 'px');

// Create the table element and add it to the DOM
let boardCanvas = document.getElementById('game-board') as HTMLCanvasElement;

boardCanvas.style.cursor = "pointer";
boardCanvas.width = cols * cellWidth;
boardCanvas.height = rows * cellWidth;

paper.setup(boardCanvas);

// Loading texture for each tetramino piece color
let textures: paper.Raster[] = [];
let image = new paper.Raster('./tetrominoes.png');

image.remove();
image.on('load', () => {
    const pieceSize = new paper.Size(image.height, image.height);

    // Loop through each square
    for (let i = 0; i < 7; i++) {
        // Get the image data for the current square
        let imageData = image.getImageData(new paper.Rectangle(new paper.Point(i * pieceSize.width, 0), pieceSize));

        // Create a new canvas to draw the image data on
        let canvas = document.createElement('canvas');
        canvas.width = pieceSize.width;
        canvas.height = pieceSize.height;

        // Get the 2D context of the canvas
        let context = canvas.getContext('2d');

        // Draw the image data on the canvas
        context.putImageData(imageData, 0, 0);

        // Create a new Raster object from the canvas
        let piece = new paper.Raster(canvas);
        piece.pivot = piece.bounds.topLeft;
        piece.scale(cellWidth / image.height);
        piece.remove();

        textures.push(piece);
    }

    // Function to update piece on the canvas
    let activePieces: (paper.Raster | null)[] = [];

    function setPieceOnCanvas(x: number, y: number, index: number) {
        // Calculate index in the list
        const i = cols * y + x;

        // Remove old sprite, if there was any
        activePieces[i]?.remove();
        activePieces[i] = null;

        // Add new sprite on location, if not empty piece
        if (index !== 0) {
            let piece = textures[index - 1].clone();
            piece.position = new paper.Point(x * cellWidth, y * cellWidth);
            piece.smoothing = 'off';

            activePieces[i] = piece;
            paper.project.activeLayer.addChild(piece);
        }
    }

    // Initialize the board and add random pieces
    let board: Board = new Board(rows, cols, setPieceOnCanvas);

    board.forEachIndex((x, y) => {
        const index = random.chance(0.1) ? random.range(1, 7) : 0;
        board.setPiece(x, y, index);
    });
});
