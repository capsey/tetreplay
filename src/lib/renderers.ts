import * as paper from 'paper';

import { Matrix } from './utilities';
import { getBlocks } from './pieces';
import type { Piece } from './types';

interface BlockSprite {
    raster: paper.Raster;
    rect: paper.Rectangle;
    color: number;
}

export class BoardRenderer {
    private sprites: Matrix<BlockSprite>;
    private theme: BoardTheme;
    private layer: paper.Layer;

    public constructor(rows: number, cols: number, cellSize: number) {
        this.theme = unloadedTheme;
        this.layer = new paper.Layer();

        // Creating each block raster
        const size = new paper.Size(cellSize, cellSize);

        this.sprites = new Matrix(rows, cols);
        this.sprites.forEach((x, y) => {
            // Calculate sprite size and position
            const position = new paper.Point(x * cellSize, y * cellSize);
            const rect = new paper.Rectangle(position, size);

            // Create sprite object onto the layer
            const raster = new paper.Raster(this.theme.textures[0]);

            this.layer.addChild(raster);

            // Set sprite properties
            raster.fitBounds(rect);
            raster.smoothing = 'off';
            raster.visible = false;

            this.sprites.setItem(x, y, { raster, rect, color: -1 });
        });
    }

    public setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.sprites.forEach((x, y) => {
            const sprite = this.sprites.getItem(x, y);
            const texture = this.theme.textures[Math.max(sprite.color, 0)];

            // Reassign texture and account for new size
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
    private layer: paper.Layer;

    public constructor(piece: Piece, cellSize: number, opacity?: number) {
        this.theme = unloadedTheme;
        this.layer = new paper.Layer();

        // Creating each block raster
        const size = new paper.Size(cellSize, cellSize);

        this.sprites = getBlocks(piece).map(block => {
            // Calculate sprite size and position
            const position = new paper.Point(block.x * cellSize, block.y * cellSize);
            const rect = new paper.Rectangle(position, size);

            // Create sprite object onto the layer
            const raster = new paper.Raster(this.theme.textures[piece.type]);

            this.layer.addChild(raster);

            // Set sprite properties
            raster.fitBounds(rect);
            raster.smoothing = 'off';
            raster.opacity = opacity || 1;

            return { raster, color: piece.type, rect };
        });
    }

    public set visible(value: boolean) {
        this.layer.visible = value;
    }

    public setTheme(theme: BoardTheme) {
        this.theme = theme;
        this.sprites.forEach(sprite => {
            const texture = this.theme.textures[sprite.color];

            // Reassign texture and account for new size
            sprite.raster.setImageData(texture);
            sprite.raster.fitBounds(sprite.rect);
        })
    }

    public setPiece(piece: Piece, cellSize: number) {
        // Change color of blocks
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

// Board theme related stuff
export type BoardTheme = {
    textures: ImageData[];
    textureSize: number;
};

export async function getTheme(imageSource: string): Promise<BoardTheme> {
    // Load requested texture using URL
    const res = await fetch(imageSource);
    const blob = await res.blob();

    if (!res.ok) {
        throw new Error("Could not load theme texture!");
    }

    const image = await createImageBitmap(blob);

    // Create canvas to hold image texture
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    context.drawImage(image, 0, 0);

    // Split the image into 7 squares
    const textures = [];
    const textureSize = image.width / 7;

    for (let i = 0; i < 7; i++) {
        const imageData = context.getImageData(i * textureSize, 0, textureSize, image.height);
        textures.push(imageData);
    }

    return { textures, textureSize };
}

// Unloaded board theme
function createSolidTexture(color: string): ImageData {
    // Create canvas to fill with color
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    // Fill with specified color and return ImageData
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1);
}

const unloadedColors = ['#00ffff', '#0000ff', '#ffa500', '#ffff00', '#00ff00', '#800080', '#ff0000'];
const unloadedTheme: BoardTheme = {
    textures: unloadedColors.map(color => createSolidTexture(color)),
    textureSize: 1,
};