import * as paper from 'paper';

import { Matrix } from './utilities';
import { BoardTheme, themes, onThemeLoaded } from './tetris-resources';
import { Board, Piece } from './tetris-types';
import { getBlocks, getSpawnPosition } from './tetris-tetrominoes';
import { Input, applyInput, hardDrop } from './tetris-rules';

interface BlockSprite {
    raster: paper.Raster;
    rect: paper.Rectangle;
    color: number;
}

export class BoardRenderer {
    private sprites: Matrix<BlockSprite>;
    private theme: BoardTheme;

    public constructor(layer: paper.Layer, rows: number, cols: number, cellSize: number, theme?: BoardTheme) {
        // Assigning default theme if not provided
        this.theme = theme || themes[0];

        // Update the textures when current theme has loaded
        onThemeLoaded((theme) => {
            if (theme === this.theme) this.updateTextures();
        });

        // Creating each block raster
        const size = new paper.Size(cellSize, cellSize);

        this.sprites = new Matrix(rows, cols, (x, y) => {
            const position = new paper.Point(x * cellSize, y * cellSize);
            const rect = new paper.Rectangle(position, size);
            const raster = new paper.Raster(this.theme.textures[0]);

            layer.addChild(raster);

            raster.fitBounds(rect);
            raster.smoothing = 'off';
            raster.visible = false;

            return { raster, rect, color: -1 };
        });
    }

    public setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.updateTextures();
    }

    public updateTextures() {
        this.sprites.forEach((x, y) => {
            const sprite = this.sprites.getItem(x, y);
            const texture = this.theme.textures[Math.max(sprite.color, 0)];

            sprite.raster.setImageData(texture);
            sprite.raster.fitBounds(sprite.rect);
        })
    }

    public setBlock(x: number, y: number, index: number) {
        const sprite = this.sprites.getItem(x, y);

        if (sprite.color === index) {
            return;
        } else if (index < 0) {
            // Hide empty blocks
            sprite.raster.visible = false;
        } else {
            // Change color of the block
            const texture = this.theme.textures[index];

            sprite.raster.visible = true;
            sprite.raster.setImageData(texture);
        }

        sprite.color = index;
    }
}

export class PieceRenderer {
    private sprites: BlockSprite[];
    private theme: BoardTheme;

    public constructor(layer: paper.Layer, piece: Piece, cellSize: number, opacity?: number, theme?: BoardTheme) {
        // Assigning default theme if not provided
        this.theme = theme || themes[0];

        // Update the textures when current theme has loaded
        onThemeLoaded((theme) => {
            if (theme === this.theme) this.updateTextures();
        });

        // Creating each block raster
        const size = new paper.Size(cellSize, cellSize);

        this.sprites = getBlocks(piece).map(block => {
            const position = new paper.Point(block.x * cellSize, block.y * cellSize);
            const rect = new paper.Rectangle(position, size);
            const raster = new paper.Raster(this.theme.textures[piece.type]);

            layer.addChild(raster);

            raster.fitBounds(rect);
            raster.smoothing = 'off';
            raster.opacity = opacity || 1;

            return { raster, color: piece.type, rect };
        });
    }

    public set visible(value: boolean) {
        this.sprites.forEach(sprite => sprite.raster.visible = value);
    }

    public setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.updateTextures();
    }

    public updateTextures() {
        this.sprites.forEach(sprite => {
            const texture = this.theme.textures[sprite.color];

            sprite.raster.setImageData(texture);
            sprite.raster.fitBounds(sprite.rect);
        })
    }

    public setPiece(piece: Piece, cellSize: number) {
        // Change color of the block
        const texture = this.theme.textures[piece.type];
        const size = new paper.Size(cellSize, cellSize);
        const blocks = getBlocks(piece);

        for (let i = 0; i < blocks.length; i++) {
            const position = new paper.Point(blocks[i].x * cellSize, blocks[i].y * cellSize);
            const rect = new paper.Rectangle(position, size);

            this.sprites[i].raster.setImageData(texture);
            this.sprites[i].raster.fitBounds(rect);
            this.sprites[i].color = piece.type;
        }
    }
}

export class PlayerRenderer {
    public piece: Piece;

    private fallingPiece: PieceRenderer;
    private ghostPiece: PieceRenderer;

    constructor(layer: paper.Layer, pieceType: number, board: Board, cellSize: number, theme?: BoardTheme) {
        this.piece = getSpawnPosition(pieceType);

        this.fallingPiece = new PieceRenderer(layer, this.piece, cellSize, 1, theme);
        this.ghostPiece = new PieceRenderer(layer, hardDrop(this.piece, board), cellSize, 0.5, theme);
    }

    public set visible(value: boolean) {
        this.fallingPiece.visible = value;
        this.ghostPiece.visible = value;
    }

    public setPiece(piece: Piece, board: Board, cellSize: number) {
        this.piece = piece;
        this.fallingPiece.setPiece(piece, cellSize);
        this.ghostPiece.setPiece(hardDrop(piece, board), cellSize);
    }

    public applyInput(input: Input, board: Board, cellSize: number) {
        const piece = applyInput(this.piece, board, input);
        if (piece) this.setPiece(piece, board, cellSize);
    }
}
