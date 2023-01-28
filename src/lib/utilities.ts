// Utility functions for built-in Array type
declare global {
    interface Array<T> {
        min(fn: (value: T) => number): T | null;
        max(fn: (value: T) => number): T | null;
    }
}

Array.prototype.min = function <T>(this: Array<T>, fn: (value: T) => number): T | null {
    return this.reduce((min, x) => min && fn(min) <= fn(x) ? min : x, null);
}

Array.prototype.max = function <T>(this: Array<T>, fn: (value: T) => number): T | null {
    return this.reduce((max, x) => max && fn(max) >= fn(x) ? max : x, null);
}

// Two dimensional array of generic type
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