export type PieceType = typeof pieceTypes[number];
export const pieceTypes = [
    'i-piece',
    'j-piece',
    'l-piece',
    'o-piece',
    's-piece',
    't-piece',
    'z-piece',
] as const;

export type ActionType = typeof actionTypes[number];
export const actionTypes = [
    'shift_left',
    'shift_right',
    'soft_drop',
    'rotate_90',
    'rotate_180',
    'rotate_270',
    'hold',
    'lock',
    'clear_lines',
] as const;

// Piece object
export type PiecePosition = {
    x: number;
    y: number;
    rotation: 0 | 1 | 2 | 3;
};

const pieces = new Map<PieceType, [number, number][][]>([
    ['i-piece', [
            [[0, 1], [1, 1], [2, 1], [3, 1]],
            [[2, 0], [2, 1], [2, 2], [2, 3]],
            [[0, 2], [1, 2], [2, 2], [3, 2]],
            [[1, 0], [1, 1], [1, 2], [1, 3]],
        ],
    ],
    ['j-piece', [
            [[0, 0], [0, 1], [1, 1], [2, 1]],
            [[1, 0], [1, 1], [1, 2], [2, 0]],
            [[0, 1], [1, 1], [2, 1], [2, 2]],
            [[0, 2], [1, 0], [1, 1], [1, 2]],
        ],
    ],
    ['l-piece', [
            [[0, 1], [1, 1], [2, 1], [2, 0]],
            [[1, 0], [1, 1], [1, 2], [2, 2]],
            [[0, 1], [0, 2], [1, 1], [2, 1]],
            [[0, 0], [1, 0], [1, 1], [1, 2]],
        ],
    ],
    ['o-piece', [
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
            [[0, 0], [0, 1], [1, 0], [1, 1]],
        ],
    ],
    ['s-piece', [
            [[0, 1], [1, 1], [1, 0], [2, 0]],
            [[1, 0], [1, 1], [2, 1], [2, 2]],
            [[0, 2], [1, 2], [1, 1], [2, 1]],
            [[0, 0], [0, 1], [1, 1], [1, 2]],
        ],
    ],
    ['t-piece', [
            [[0, 1], [1, 1], [1, 0], [2, 1]],
            [[1, 0], [1, 1], [1, 2], [2, 1]],
            [[0, 1], [1, 1], [1, 2], [2, 1]],
            [[0, 1], [1, 0], [1, 1], [1, 2]],
        ],
    ],
    ['z-piece', [
            [[0, 0], [1, 0], [1, 1], [2, 1]],
            [[1, 2], [1, 1], [2, 1], [2, 0]],
            [[0, 1], [1, 1], [1, 2], [2, 2]],
            [[0, 2], [0, 1], [1, 1], [1, 0]],
        ],
    ],
]);

export function getBlocks({ x, y, rotation }: PiecePosition, pieceType: PieceType) {
    return pieces.get(pieceType)![rotation].map(([dx, dy]) => [x + dx, y + dy]) as [number, number][];
}

// Board
export class Board {
    private data: number[];

    constructor(
        public readonly rows: number,
        public readonly cols: number,
        data: number[] | number,
    ) {
        if (Array.isArray(data)) {
            this.data = data;
        } else {
            this.data = new Array(rows * cols);
            this.forEach((x, y) => this.set(x, y, data));
        }
    }

    public get(x: number, y: number) {
        return this.data[this.cols * y + x];
    }

    public set(x: number, y: number, value: number) {
        this.data[this.cols * y + x] = value;
    }

    public forEach(fn: (x: number, y: number, value: number) => void) {
        for (let j = 0; j < this.rows; j++) {
            for (let i = 0; i < this.cols; i++) {
                fn(i, j, this.get(i, j));
            }
        }
    }

    public isEmpty(x: number, y: number) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows && this.get(x, y) < 0;
    }

    public clearLines() {
        for (let row = 0; row < this.rows; row++) {
            let clear = true;

            for (let i = 0; i < this.cols; i++) {
                if (!this.isEmpty(i, row)) return;
                clear = false;
                break;
            }

            if (!clear) continue;

            for (let j = row; j >= 0; j--) {
                for (let i = 0; i < this.cols; i++) {
                    const value = row > 0 ? this.get(i, j - 1) : -1;
                    this.set(i, j, value);
                }
            }
        }
    }
}


// Piece generators
export interface PieceGenerator {
    options(): Set<PieceType>;
    next(selected: PieceType): void;
}

export class ModernPieceBag implements PieceGenerator {
    private bag: Set<PieceType>;

    constructor() {
        this.bag = new Set();
    }

    options(): Set<PieceType> {
        return new Set(pieceTypes.filter(piece => !this.bag.has(piece)));
    }

    next(selected: PieceType): void {
        if (this.bag.size >= 7) {
            this.bag.clear();
        }

        this.bag.add(selected);
    }
}
