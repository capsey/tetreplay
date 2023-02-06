import { onDestroy } from "svelte";
import { writable, type StartStopNotifier, type Subscriber } from "svelte/store";

// Observable event
export function event<T>(value?: T, start?: StartStopNotifier<T>) {
    const store = writable<T>(value, start);

    return {
        subscribe: (run: Subscriber<T>) => {
            // Subscribe and unsubscribe automatically
            // Only run inside of a svelte component
            const unsubscribe = store.subscribe(run);
            onDestroy(unsubscribe);
        },
        emit: (value: T) => {
            // Emits event with a given value as a message
            store.set(value);
        },
    };
}

// Animation frame handler
export function frameHangler(func: (elapsed: number) => boolean, elapsedLimit: number = 1 / 10) {

    let lastFrame: number;
    let lastTime: number;

    const callback = () => {
        const time = performance.now() / 1000;
        const elapsed = (time - lastTime);
        lastTime = time;

        if (func(Math.min(elapsed, elapsedLimit))) {
            lastFrame = requestAnimationFrame(callback);
        }
    };

    return () => {
        cancelAnimationFrame(lastFrame);
        lastTime = performance.now() / 1000;
        lastFrame = requestAnimationFrame(callback);
    };
}