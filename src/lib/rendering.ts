import { getBlocks } from "./pieces";
import type { BoardState, ColoredBlock, Piece } from "./types";

// Drawing functions
export function drawBoard(context: CanvasRenderingContext2D, board: BoardState, theme: BoardTheme, opacity: number = 1) {
    context.globalAlpha = opacity;

    board.forEach((x, y, color) => {
        if (color < 0) return;

        const texture = theme.textures[color];
        context.drawImage(texture, x * theme.size, y * theme.size);
    });
}

export function drawPiece(context: CanvasRenderingContext2D, piece: Piece, theme: BoardTheme, opacity: number = 1) {
    context.globalAlpha = opacity;

    const texture = theme.textures[piece.type];

    getBlocks(piece).forEach(({ x, y }) => {
        context.drawImage(texture, x * theme.size, y * theme.size);
    });
}

export type UnalignedBlock = ColoredBlock & { rotation: number };

export function drawUnalignedBlock(context: CanvasRenderingContext2D, block: UnalignedBlock, theme: BoardTheme, opacity: number = 1, scale?: number) {
    context.save();

    context.translate(block.x, block.y);
    context.rotate(block.rotation);

    const texture = theme.textures[block.color];
    const size = scale || theme.size;

    context.globalAlpha = opacity;
    context.drawImage(texture, size * -0.5, size * -0.5, size, size);

    context.restore();
}

// Board theme related stuff
export type BoardThemeSource = {
    name: string;
    texture: string;
    size: number;
};

export type BoardTheme = {
    textures: CanvasImageSource[];
    size: number;
};

export async function getTheme(source: BoardThemeSource): Promise<BoardTheme> {
    // Load requested texture using URL
    const res = await fetch(source.texture);

    if (!res.ok) {
        throw new Error("Could not load theme texture!");
    }

    const blob = await res.blob();
    const texture = await createImageBitmap(blob);

    // Split the image into 7 squares
    const textures = [];

    for (let i = 0; i < 7; i++) {
        const subtexture = createImageBitmap(texture, i * source.size, 0, source.size, source.size);
        textures.push(subtexture);
    }

    return { textures: await Promise.all(textures), size: source.size };
}

// Unloaded board theme
function createSolidTexture(color: string): CanvasImageSource {
    // Create canvas to fill with color
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;

    // Fill with specified color and return ImageData
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return canvas;
}

const unloadedColors = ["#00ffff", "#0000ff", "#ffa500", "#ffff00", "#00ff00", "#800080", "#ff0000"];
const unloadedTextures = unloadedColors.map(color => createSolidTexture(color));
export const unloadedTheme: BoardTheme = { textures: unloadedTextures, size: 1 };

// Built-in board themes
export const themes: BoardThemeSource[] = [
    { name: "Tetris 99", texture: "theme-99.png", size: 48 },
    { name: "Tetris Party Deluxe", texture: "theme-party.png", size: 32 },
    { name: "TETR.IO", texture: "theme-tetrio.png", size: 48 },
    { name: "NES", texture: "theme-nes.png", size: 8 },
    { name: "SNES", texture: "theme-snes.png", size: 8 },
];