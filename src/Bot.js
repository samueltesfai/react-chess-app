import * as tf from '@tensorflow/tfjs';
import mapping from "./mapping.json";
import { MaxPriorityQueue } from '@datastructures-js/priority-queue';

class Bot {

    static loaded = false;


    constructor(gameState, color, depth,) {
        this.gameState = gameState;
        this.color = color;
        this.depth = depth;
        Bot.init();
    }

    static async init() {
        Bot.nexttMoveModel = await tf.loadLayersModel(
            `${process.env.PUBLIC_URL}/tfjs_models/task1/model3-2/model.json`
        );
        Bot.loaded = true;
    }


    move() {

        let [value, bestMove] = Bot.#alphaBetaPruning(
            this.gameState,
            this.depth,
            -Infinity,
            Infinity,
            this.color === 'b',
            this.heuristic
        )
        return bestMove;
    }

    static #alphaBetaPruning(gameState, depth, alpha, beta, maximizngPlayer) {
        // hard code checkmates to be best move to take
        if (gameState.isCheckmate()) {
            return [maximizngPlayer ? -100 - depth : 100 + depth, null];
        }
        if (depth === 0 || gameState.isGameOver()) {
            return [gameState.blackAdvantage(), null]; // using black material advantage as heuristic
        }

        //predicts the most likely move from given board position
        let features = gameState.features();
        let preds = Bot.nexttMoveModel.predict(features).arraySync()[0];

        // from possible legals moves, we only consider the top k most probable
        let moveSet = gameState.moves({ verbose: true });
        moveSet = moveSet.filter(x => !(x.promotion) || x.promotion === 'q') //only consider queen promotions
        moveSet.forEach(x => x.probabilty = preds[mapping[x.from.concat(x.to)]])

        const mpq = MaxPriorityQueue.fromArray(moveSet, x => x.probabilty);

        let move = null;
        let k = 30;
        if (maximizngPlayer) {
            let value = -Infinity;

            while (k > 0 && moveSet.length !== 0) {
                //let child = new Chess(gameState.fen());
                const potentialMove = mpq.dequeue();

                gameState.move(potentialMove);
                let tmp = Bot.#alphaBetaPruning(gameState, depth - 1, alpha, beta, false);
                gameState.undo();

                if (tmp[0] > value) {

                    value = tmp[0];
                    move = potentialMove;
                }

                if (value >= beta) {
                    break;
                }
                alpha = Math.max(alpha, value);

                k--;
            }

            return [value, move];
        }
        else {

            let value = Infinity;
            while (k > 0 && moveSet.length !== 0) {
                //let child = new Chess(gameState.fen());
                const potentialMove = mpq.dequeue();

                gameState.move(potentialMove);

                let tmp = Bot.#alphaBetaPruning(gameState, depth - 1, alpha, beta, true);

                gameState.undo()

                if (tmp[0] < value) {
                    value = tmp[0];
                    move = potentialMove;
                }

                if (value <= alpha) {
                    break;
                }
                beta = Math.min(beta, value);

                k--;
            }
            return [value, move];
        }
    }

    static featureExtractor(gameState) {
        let bitboard = tf.buffer([1, 8, 8, 12]);
        const gameBoard = gameState.board();
        const values = { r: 5, p: 1, b: 3, n: 3, q: 9, k: 0 };
        let whiteMaterial = 0, blackMaterial = 0;
        const moveNum = gameState.history().length;
        const blackTurn = gameState.turn() === "b";
        for (let H = 0; H < 8; H++) {
            for (let W = 0; W < 8; W++) {

                if (!gameBoard[H][W]) continue;

                let type = gameBoard[H][W].type;
                let color = gameBoard[H][W].color;

                if (color === "w") {
                    whiteMaterial += values[type]
                }
                else {
                    blackMaterial += values[type];
                }

                let C = null;

                if (type === 'p') {
                    C = 0;
                }
                else if (type === 'n') {
                    C = 1;
                }
                else if (type === 'b') {
                    C = 2;
                }
                else if (type === "r") {
                    C = 3;
                }
                else if (type === "q") {
                    C = 4;
                }
                else if (type === 'k') {
                    C = 5;
                }

                if (color === "b") {
                    C += 6
                }

                bitboard.set(1, 0, H, W, C)

            }
        }
        return [bitboard.toTensor(), tf.tensor([moveNum, whiteMaterial, blackMaterial, blackTurn], [1, 4], 'float32')]
    }

}
export default Bot;