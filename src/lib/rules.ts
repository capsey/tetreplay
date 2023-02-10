import {
    Board,
    getBlocks,
    type ActionType,
    type PiecePosition,
    type PieceType,
} from './types';

type RuleSet = {};

export class RulesHandler {
    constructor(private parameters: RuleSet) {}

    public applyAction(
        action: ActionType,
        board: Board,
        piecePosition: PiecePosition,
        pieceType: PieceType,
    ) {
        let pos = { ...piecePosition };

        switch (action) {
            case 'shift_left':
                pos.x -= 1;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            case 'shift_right':
                pos.x += 1;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            case 'soft_drop':
                pos.y += 1;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            case 'rotate_90':
                pos.rotation = ((pos.rotation + 1) % 4) as 0 | 1 | 2 | 3;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            case 'rotate_180':
                pos.rotation = ((pos.rotation + 2) % 4) as 0 | 1 | 2 | 3;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            case 'rotate_270':
                pos.rotation = ((pos.rotation + 3) % 4) as 0 | 1 | 2 | 3;
                if (!this.isColliding(board, ...getBlocks(pos, pieceType)))
                    return pos;
                break;

            default:
                throw new Error('Not implemented!');
        }
    }

    public isColliding(board: Board, ...blocks: [number, number][]) {
        return blocks.some(([x, y]) => board.get(x, y) >= 0);
    }
}
