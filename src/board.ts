export class Board {
    public rows: number;
    public cols: number;

    private list: number[];
    private onChanged?: (x: number, y: number, index: number) => void;

    constructor(rows: number, cols: number, onChanged?: (x: number, y: number, index: number) => void) {
        this.rows = rows;
        this.cols = cols;
        this.list = [];
        this.onChanged = onChanged;
        this.forEachIndex((x, y) => this.setPiece(x, y, 0));
    }

    setPiece(x: number, y: number, index: number) {
        this.list[this.cols * y + x] = index;
        this.onChanged?.(x, y, index);
    }

    getPiece(x: number, y: number): number {
        return this.list[this.cols * y + x];
    }

    forEachIndex(callback: (x: number, y: number) => void) {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(x, y);
            }
        }
    }
}