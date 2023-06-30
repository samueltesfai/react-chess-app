import * as tf from '@tensorflow/tfjs';

class GameState {
    // Wrapper class for the Chess API. 
    // Allows us to readily supply tensors as the inputs to our models.

    static pieceChannel = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };
    static values = { r: 5, p: 1, b: 3, n: 3, q: 9, k: 0 };

    constructor(chessGame) {
        this.chessGame = chessGame;
        [this.input1, this.input2] = GameState.featureExtractor(chessGame);
        // input2: [moveNum, whiteMaterial, blackMaterial, blackTurn]
    }

    features = () => [this.input1.toTensor(), this.input2.toTensor()];

    //expose Chess methods:
    moves = (arg) => this.chessGame.moves(arg);

    inCheck = () => this.chessGame.inCheck();

    turn = () => this.chessGame.turn();

    isCheckmate = () => this.chessGame.isCheckmate();

    history = (arg) => this.chessGame.history(arg);

    board = () => this.chessGame.board();

    isGameOver = () => this.chessGame.isGameOver();

    move(m, debug = false) {

        let capturedPiece = this.chessGame.get(m.to);
        let movingPiece = this.chessGame.get(m.from);

        m = this.chessGame.move(m);

        if (m === null) {
            return m
        }

        let [toH, toW] = GameState.squareToIndex(m.to);
        let [fromH, fromW] = GameState.squareToIndex(m.from);

        //castling
        if (m.san === 'O-O') {
            this.input1.set(0, 0, m.color === 'w' ? 7 : 0, 7, GameState.pieceChannel['r'] + (m.color === "w" ? 0 : 6));
            this.input1.set(1, 0, m.color === 'w' ? 7 : 0, 5, GameState.pieceChannel['r'] + (m.color === "w" ? 0 : 6));
        }
        else if (m.san === 'O-O-O') {
            this.input1.set(0, 0, m.color === 'w' ? 7 : 0, 0, GameState.pieceChannel['r'] + (m.color === "w" ? 0 : 6));
            this.input1.set(1, 0, m.color === 'w' ? 7 : 0, 3, GameState.pieceChannel['r'] + (m.color === "w" ? 0 : 6));
        }

        if (m.captured) {
            let C = GameState.pieceChannel[capturedPiece.type];

            if (m.color === "w") { // or capturedPiece.color==='b'
                this.input1.set(0, 0, toH, toW, C + 6); //remove captured piece
                this.input2.set(this.input2.get(0, 2) - GameState.values[capturedPiece.type], 0, 2) //upadate material value
            }
            else {
                this.input1.set(0, 0, toH, toW, C);
                this.input2.set(this.input2.get(0, 1) - GameState.values[capturedPiece.type], 0, 1)
            }
        }

        let C = GameState.pieceChannel[movingPiece.type];

        //promoting to queen
        if (m.promotion) {
            const diff = GameState.values['q'] - GameState.values['p'];
            this.input2.set(this.input2.get(0, m.color === 'w' ? 1 : 2) + diff, 0, m.color === 'w' ? 1 : 2);
            C = GameState.pieceChannel['q'];
        }

        this.input1.set(1, 0, toH, toW, C + (m.color === "w" ? 0 : 6));
        this.input1.set(0, 0, fromH, fromW, GameState.pieceChannel[movingPiece.type] + (m.color === "w" ? 0 : 6));

        this.input2.set(this.input2.get(0, 0) + 1, 0, 0); // update moveNum
        this.input2.set((this.input2.get(0, 3) + 1) % 2, 0, 3); // update blackTurn
    }

    undo(debug = false) {

        const lastMove = this.chessGame.history({ verbose: true }).slice(-1)[0];
        const movingPiece = this.chessGame.get(lastMove.to);
        const [fromH, fromW] = GameState.squareToIndex(lastMove.from);
        const [toH, toW] = GameState.squareToIndex(lastMove.to);


        //castling
        if (lastMove.san === 'O-O') {
            this.input1.set(0, 0, lastMove.color === 'w' ? 7 : 0, 5, GameState.pieceChannel['r'] + (lastMove.color === "w" ? 0 : 6));
            this.input1.set(1, 0, lastMove.color === 'w' ? 7 : 0, 7, GameState.pieceChannel['r'] + (lastMove.color === "w" ? 0 : 6));
        }
        else if (lastMove.san === 'O-O-O') {
            this.input1.set(0, 0, lastMove.color === 'w' ? 7 : 0, 3, GameState.pieceChannel['r'] + (lastMove.color === "w" ? 0 : 6));
            this.input1.set(1, 0, lastMove.color === 'w' ? 7 : 0, 0, GameState.pieceChannel['r'] + (lastMove.color === "w" ? 0 : 6));
        }

        if (lastMove.captured) {
            let C = GameState.pieceChannel[lastMove.captured];

            if (lastMove.color === "w") {
                this.input1.set(1, 0, toH, toW, C + 6); //add back captured piece
                this.input2.set(this.input2.get(0, 2) + GameState.values[lastMove.captured], 0, 2);
            }
            else {
                this.input1.set(1, 0, toH, toW, C); //add back captured piece
                this.input2.set(this.input2.get(0, 1) + GameState.values[lastMove.captured], 0, 1);
            }
        }

        let C = GameState.pieceChannel[movingPiece.type];

        //promoting to queen
        if (lastMove.promotion) {
            const diff = GameState.values['q'] - GameState.values['p'];
            this.input2.set(this.input2.get(0, lastMove.color === 'w' ? 1 : 2) - diff, 0, lastMove.color === 'w' ? 1 : 2);
            C = GameState.pieceChannel['p'];
        }

        this.input1.set(0, 0, toH, toW, GameState.pieceChannel[movingPiece.type] + (lastMove.color === 'w' ? 0 : 6));
        this.input1.set(1, 0, fromH, fromW, C + (lastMove.color === 'w' ? 0 : 6));

        this.input2.set(this.input2.get(0, 0) - 1, 0, 0); // update moveNum
        this.input2.set((this.input2.get(0, 3) + 1) % 2, 0, 3); // update blackTurn

        this.chessGame.undo();

    }

    blackAdvantage = () => this.input2.get(0, 2) - this.input2.get(0, 1);


    static squareToIndex(square) {
        let H = 8 - parseInt(square.charAt(1));
        let W = square.charCodeAt(0) - "a".charCodeAt(0);
        return [H, W]
    }


    static featureExtractor(gameState) {
        let bitboard = tf.buffer([1, 8, 8, 12]);
        const gameBoard = gameState.board();
        let whiteMaterial = 0, blackMaterial = 0;
        const moveNum = gameState.history().length;
        const blackTurn = gameState.turn() === "b";
        for (let H = 0; H < 8; H++) {
            for (let W = 0; W < 8; W++) {

                if (!gameBoard[H][W]) continue;

                let type = gameBoard[H][W].type;
                let color = gameBoard[H][W].color;

                if (color === "w") {
                    whiteMaterial += GameState.values[type]
                }
                else {
                    blackMaterial += GameState.values[type];
                }

                let C = GameState.pieceChannel[type];

                if (color === "b") {
                    C += 6
                }

                bitboard.set(1, 0, H, W, C)

            }
        }
        return [
            bitboard,
            tf.buffer(
                [1, 4],
                'float32',
                Float32Array.from([moveNum, whiteMaterial, blackMaterial, blackTurn])
            )
        ]
    }
}
export default GameState;