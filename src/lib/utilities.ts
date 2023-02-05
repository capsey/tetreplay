// Utility functions for built-in Array type
declare global {
    interface Array<T> {
        min(fn: (value: T) => number): T | null;
        max(fn: (value: T) => number): T | null;
        remove(index: number): void;
    }
}

Array.prototype.min = function <T>(this: Array<T>, fn: (value: T) => number): T | null {
    return this.reduce((min, x) => min && fn(min) <= fn(x) ? min : x, null);
}

Array.prototype.max = function <T>(this: Array<T>, fn: (value: T) => number): T | null {
    return this.reduce((max, x) => max && fn(max) >= fn(x) ? max : x, null);
}

Array.prototype.remove = function <T>(this: Array<T>, index: number): void {
    if (index > this.length - 1 || index < 0) return;

    for (let i = 0; i < this.length; i++) {
        if (i >= index) {
            this[i] = this[i + 1];
        }
    }

    this.pop();
}

// Two dimensional array of generic type
export class Matrix<T> {
    public rows: number;
    public cols: number;

    private data: T[];

    public constructor(rows: number, cols: number, data?: T[] | T) {
        this.rows = rows;
        this.cols = cols;

        if (Array.isArray(data)) {
            this.data = data;
        } else {
            this.data = new Array(rows * cols);

            if (data) this.forEach((x, y) => this.set(x, y, data));
        }
    }

    public copy(): Matrix<T> {
        return new Matrix(this.rows, this.cols, [...this.data]);
    }

    public get(x: number, y: number): T {
        return this.data[this.cols * y + x];
    }

    public set(x: number, y: number, value: T) {
        this.data[this.cols * y + x] = value;
    }

    public forEach(callback: (x: number, y: number, value: T) => void) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(x, y, this.get(x, y));
            }
        }
    }
}