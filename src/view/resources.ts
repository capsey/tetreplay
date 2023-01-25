import { pieceColors } from '../game/pieces';

// Resources for themes that have not yet been loaded
function createSolidTexture(color: string): ImageData {
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1);
}

const unloadedTextures = pieceColors.map(color => createSolidTexture(color));

// Global theme loaded event
const eventListeners: ((theme: BoardTheme) => void)[] = [];

export function onThemeLoaded(callback: (theme: BoardTheme) => void) {
    eventListeners.push(callback);
}

export class BoardTheme {
    public name: string;
    public textures: ImageData[];
    public textureSize: number;

    public constructor(name: string, imageSource: string) {
        this.name = name;
        this.textures = unloadedTextures;
        this.textureSize = 1;

        fetch(imageSource)
            .then(response => response.blob())
            .then(blob => createImageBitmap(blob))
            .then(image => {
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

                this.setTextures(textures, textureSize);
            });
    }

    public setTextures(textures: ImageData[], textureSize: number) {
        this.textures = textures;
        this.textureSize = textureSize;

        eventListeners.forEach(fn => fn(this));
    }
}

// List of all built-in themes
export const themes = [
    new BoardTheme('Default', 'tetrominoes.png')
];
