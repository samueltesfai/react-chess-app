import { Chess } from "chess.js";

class Bot {

    constructor(heuristic, gameState, color, depth,) {
        this.heuristic = heuristic;
        this.gameState = gameState;
        this.color = color;
        this.depth = depth;
    }


    move() {
        
        let [value,bestMove] = Bot.#alphaBetaPruning(
            this.gameState,
            this.depth,
            -Infinity,
            Infinity,
            true,
            this.heuristic
        )

        if (this.gameState.move(bestMove) === null) {
            this.gameState.move({ ...bestMove, promotion: 'q' });
        }
        return Object.values(bestMove);

    }




    static #alphaBetaPruning(gameState, depth, alpha, beta, maximizngPlayer, heuristic) {

        if (gameState.isCheckmate()) {
            return [maximizngPlayer ? -100 - depth : 100 + depth, null];
        }
        if (depth === 0 || gameState.isGameOver()) {
            return [heuristic(gameState), null];
        }
        const promotion = 'q';
        const pawnPromotions = new Set();
        if (maximizngPlayer) {
            let value = -Infinity;
            let move = null;

            for (const { from, to } of gameState.moves({ verbose: true }).reverse()) {
                if (pawnPromotions.has(from)) {
                    continue;
                }
                let child = new Chess(gameState.fen());
                if (child.move({ from, to }) === null) {
                    child.move({ from, to, promotion });
                    pawnPromotions.add(from);
                }

                let tmp = this.#alphaBetaPruning(child, depth - 1, alpha, beta, false, heuristic);

                if (tmp[0] > value) {

                    value = tmp[0];
                    move = { from, to };
                }

                if (value >= beta) {
                    break;
                }
                alpha = Math.max(alpha, value);
            }

            return [value, move];
        }
        else {

            let value = Infinity;
            let move = null;
            for (const { from, to } of gameState.moves({ verbose: true })) {

                if (pawnPromotions.has(from)) {
                    continue;
                }
                let child = new Chess(gameState.fen());
                if (child.move({ from, to }) === null) {
                    child.move({ from, to, promotion });
                    pawnPromotions.add(from);
                }

                let tmp = this.#alphaBetaPruning(child, depth - 1, alpha, beta, true, heuristic);

                if (tmp[0] < value) {
                    value = tmp[0];
                    move = { from, to };
                }

                if (value <= alpha) {

                    break;
                }
                beta = Math.min(beta, value);
            }
            return [value, move];
        }
    }

}
export default Bot;