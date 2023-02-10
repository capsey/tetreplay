import type { RulesHandler } from './rules';
import type {
    Board,
    ActionType,
    PieceGenerator,
    PiecePosition,
    PieceType,
} from './types';

type Action = { action: ActionType; delay: number };

class Project {
    private currentBoard: Board;
    private pieces: PieceType[] = ['i-piece'];
    private actions: Action[] = [];

    private piecePosition: PiecePosition = { x: 0, y: 0, rotation: 0 };
    private hold: PieceType | null = null;

    constructor(
        private initialBoard: Board,
        private rules: RulesHandler,
        private generator: PieceGenerator,
    ) {
        this.currentBoard = this.initialBoard;
    }

    public getPiece() {
        return this.pieces[this.pieces.length - 1];
    }

    public setPiece(piece: PieceType) {
        this.pieces[this.pieces.length - 1] = piece;
    }

    public push(...actions: Action[]) {
        this.actions.push(...actions);

        actions.forEach(({ action }) => {
            switch (action) {
                case 'clear_lines':
                    this.currentBoard.clearLines();
                    break;

                case 'hold':
                    const piece =
                        this.hold || this.generator.next(this.getPiece());

                default:
                    const pos = this.rules.applyAction(
                        action,
                        this.currentBoard,
                        this.piecePosition,
                        this.getPiece(),
                    );

                    if (pos !== undefined) {
                        this.piecePosition = pos;
                    }
                    break;
            }
        });
    }
}
