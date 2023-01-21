export const random = {

    range: function (min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    chance: function (chance: number): boolean {
        return Math.random() < chance;
    },
    choose: function <T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

};

export function minBy<T>(array: T[], fn: (value: T) => number): T | null {
    return array.reduce((min, x) => min && fn(min) <= fn(x) ? min : x, null);
}

export function maxBy<T>(array: T[], fn: (value: T) => number): T | null {
    return array.reduce((max, x) => max && fn(max) >= fn(x) ? max : x, null);
}

export function modulus(x: number, n: number) {
    return ((x % n) + n) % n;
}

export class Matrix<T> {
    public rows: number;
    public cols: number;

    public data: T[];

    public constructor(rows: number, cols: number, callback?: (x: number, y: number) => T) {
        this.rows = rows;
        this.cols = cols;
        this.data = new Array<T>(rows * cols);

        if (callback) this.forEach((x, y) => this.data[this.cols * y + x] = callback(x, y));
    }

    public modify(callback: (setter: (x: number, y: number, value: T) => void) => void) {
        const matrix = new Matrix<T>(this.rows, this.cols, (x, y) => this.getItem(x, y));
        callback((x, y, value) => matrix.data[this.cols * y + x] = value);
        return matrix;
    }

    public getItem(x: number, y: number): T {
        return this.data[this.cols * y + x];
    }

    public forEach(callback: (x: number, y: number) => void) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(x, y);
            }
        }
    }
}