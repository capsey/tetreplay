export function range(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(chance: number): boolean {
    return Math.random() < chance;
}