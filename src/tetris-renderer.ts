import * as paper from 'paper';

import { Board } from './tetris-board';
import { Matrix } from './utilities';
import { BoardTheme, themes, onThemeLoaded } from './tetris-resources';
import { Piece } from './tetris';

class Block {
    constructor(public raster: paper.Raster, public index: number, public rect: paper.Rectangle) { }
}

export class BoardRenderer {
    private blocks: Matrix<Block>;
    private theme: BoardTheme;

    constructor(layer: paper.Layer, board: Board, cellWidth: number, theme?: BoardTheme) {
        // Assigning default theme if not provided
        this.theme = theme || themes[0];

        // Update the textures when current theme has loaded
        onThemeLoaded((theme) => {
            if (theme === this.theme) this.updateTextures();
        });

        // Creating each block raster
        const size = new paper.Size(cellWidth, cellWidth);

        this.blocks = new Matrix(board.rows, board.cols, undefined, (x, y) => {
            const position = new paper.Point(x * cellWidth, y * cellWidth);
            const rect = new paper.Rectangle(position, size);
            const raster = new paper.Raster(this.theme.textures[0]);

            layer.addChild(raster);

            raster.fitBounds(rect);
            raster.smoothing = 'off';
            raster.visible = false;

            return new Block(raster, 0, rect);
        });

        board.forEach((x, y) => this.setBlock(x, y, board.getItem(x, y)));
    }

    setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.updateTextures();
    }

    updateTextures() {
        this.blocks.forEach((x, y) => {
            const block = this.blocks.getItem(x, y);
            const texture = this.theme.textures[block.index === 0 ? 0 : block.index - 1];

            block.raster.setImageData(texture);
            block.raster.fitBounds(block.rect);
        })
    }

    setBlock(x: number, y: number, index: number) {
        const block = this.blocks.getItem(x, y);

        if (block.index === index) {
            return;
        } else if (index === 0) {
            // Hide empty blocks
            block.raster.visible = false;
        } else {
            // Change color of the block
            const texture = this.theme.textures[index - 1];

            block.raster.visible = true;
            block.raster.setImageData(texture);
        }

        block.index = index;
    }
}

export class PieceRenderer {
    private blocks: Block[];
    private theme: BoardTheme;

    public constructor(layer: paper.Layer, piece: Piece, cellWidth: number, theme?: BoardTheme) {
        // Assigning default theme if not provided
        this.theme = theme || themes[0];

        // Update the textures when current theme has loaded
        onThemeLoaded((theme) => {
            if (theme === this.theme) this.updateTextures();
        });

        // Creating each block raster
        const size = new paper.Size(cellWidth, cellWidth);

        this.blocks = piece.blocks.map(block => {
            const position = new paper.Point(block.x * cellWidth, block.y * cellWidth);
            const rect = new paper.Rectangle(position, size);
            const raster = new paper.Raster(this.theme.textures[piece.color]);

            layer.addChild(raster);

            raster.fitBounds(rect);
            raster.smoothing = 'off';

            return new Block(raster, piece.color, rect);
        });
    }

    public set opacity(value: number) {
        this.blocks.forEach(x => x.raster.opacity = value);
    }

    public setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.updateTextures();
    }

    public updateTextures() {
        this.blocks.forEach(block => {
            const texture = this.theme.textures[block.index];

            block.raster.setImageData(texture);
            block.raster.fitBounds(block.rect);
        })
    }

    public setPiece(piece: Piece, cellWidth: number) {
        // Change color of the block
        const texture = this.theme.textures[piece.color];
        const size = new paper.Size(cellWidth, cellWidth);

        for (let i = 0; i < piece.blocks.length; i++) {
            const position = new paper.Point(piece.blocks[i].x * cellWidth, piece.blocks[i].y * cellWidth);
            const rect = new paper.Rectangle(position, size);

            this.blocks[i].raster.setImageData(texture);
            this.blocks[i].raster.fitBounds(rect);
            this.blocks[i].index = piece.color;
        }

        this.blocks.forEach(block => {

        });
    }
}
