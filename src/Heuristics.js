
export const dumbHeuristic = (gameState) => gameState.moves({ verbose: true })[0];

export function materialHeuristic(gameState) {
    let blacks = 0;
    let whites = 0;
    const values = { r: 5, p: 1, b: 3, n: 3, q: 9, k: 0 };
    for (let row of gameState.board()) {
        for (let square of row) {
            if (square !== null) {
                if (square.color === 'b') {
                    blacks = blacks + values[square.type];
                }
                else {
                    whites = whites + values[square.type];
                }
            }
        }
    }
    return blacks - whites;
}

