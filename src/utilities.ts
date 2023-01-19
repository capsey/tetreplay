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

export class Matrix<T> {
    public rows: number;
    public cols: number;

    private data: T[];

    constructor(rows: number, cols: number, data?: T[], callback?: (x: number, y: number) => T) {
        this.rows = rows;
        this.cols = cols;
        this.data = data || new Array<T>(rows * cols);

        if (callback) this.forEach((x, y) => this.data[this.cols * y + x] = callback(x, y));
    }

    modify(callback: (setter: (x: number, y: number, value: T) => void) => void) {
        const data = [...this.data];
        callback((x, y, value) => data[this.cols * y + x] = value);
        return new Matrix(this.rows, this.cols, data);
    }

    getItem(x: number, y: number): T {
        return this.data[this.cols * y + x];
    }

    forEach(callback: (x: number, y: number) => void) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(x, y);
            }
        }
    }
}