<script lang="ts">
    import { lastClearedLines } from "./stores/board";
    import { theme } from "./stores/preferences";
    import { frameHangler } from "./stores/utilities";
    import type { Block } from "./types";

    // Canvas
    export let transform: { x: number; y: number; scale: number };
    export let canvas: HTMLCanvasElement;

    let context: CanvasRenderingContext2D;
    $: context = canvas?.getContext("2d");

    // Line clear event
    lastClearedLines.subscribe(({ blocks }) => {
        if (!canvas || !context) return;

        fadingBlocks = [...fadingBlocks, ...blocks.map(spawnBlock)];
        request();
    });

    function spawnBlock(block: Block & { color: number }) {
        return {
            color: block.color,
            x: block.x + 0.5,
            vx: 2 * Math.random() - 1,
            y: block.y + 0.5,
            vy: 5 * Math.random() - 1,
            rotation: 0,
            vr: 3 * Math.random() - 1.5,
            opacity: 1,
        };
    }

    // Rendering
    let fadingBlocks: ReturnType<typeof spawnBlock>[] = [];
    
    let request = frameHangler((elapsed) => {
        if (!fadingBlocks) return false;

        // Reset canvas
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = false;

        // Draw all blocks
        context.save();
        context.translate(transform.x, transform.y);
        context.scale(transform.scale, transform.scale);

        const gravity = 10;
        const fading = 2;

        for (let i = fadingBlocks.length - 1; i >= 0; i--) {
            const block = fadingBlocks[i];

            // Update block properties
            block.x += block.vx * elapsed;
            block.y += block.vy * elapsed;
            block.vy += gravity * elapsed;
            block.rotation += block.vr * elapsed;
            block.opacity -= fading * elapsed;

            if (block.opacity < 0) {
                fadingBlocks.remove(i);
                continue;
            }

            // Draw it on the canvas
            context.save();

            context.translate(block.x, block.y);
            context.rotate(block.rotation);

            const texture = $theme.textures[block.color];

            context.globalAlpha = block.opacity;
            context.drawImage(texture, -0.5, -0.5, 1, 1);

            context.restore();
        }

        context.restore();
        return true;
    });
</script>
