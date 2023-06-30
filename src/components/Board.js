import { useState, useEffect, useRef } from "react";
import Square from "./Square"

function Board(props) {

    const { gameState, moveTaken, setMoveTaken, BlackBot } = props;
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [blackMove, setBlackMove] = useState([]);
    const gameBoard = gameState.board();
    const from = useRef('');

    if (props.clear.current) {
        if (gameState.history().length > 0) {
            let lastMove = gameState.history({ verbose: true }).slice(-1)[0];
            setBlackMove([lastMove.from, lastMove.to]);
        }
        else blackMove.length = 0;
        possibleMoves.length = 0;
        from.current = '';
        props.clear.current = false;
    }

    useEffect(() => {
        //black makes a move
        if (gameState.turn() === 'b' && !gameState.isGameOver()) {

            let timerPromise = new Promise((resolve, reject) => {
                setTimeout(resolve, 3000);
            });

            let movePromise = new Promise((resolve) => {
                // wait for 200 to make sure the browser updates screen properly before execution
                setTimeout(() => {
                    let move = BlackBot.current.move();
                    resolve(move);
                }, 200);
            });

            Promise.all([movePromise, timerPromise]).then((values) => {
                gameState.move(values[0]);
                setBlackMove([values[0].from, values[0].to]);
                setMoveTaken(!moveTaken);
            });
        }

        //send message if gameover
        if (gameState.isGameOver()) {

            let result;

            if (gameState.isCheckmate()) {
                result = gameState.turn() === 'b' ? "White Wins!" : "Black Wins!"
            }
            else result = "Match Draw!";

            setTimeout(() => {
                alert(result);
            }, 1500);
        }


    })

    const Squares = [];

    for (let i = 0; i < 9; i++) {
        let row = gameBoard[i];
        let isBlack = i % 2 === 0 ? false : true;
        let rank = (8 - i).toString();
        for (let j = 0; j < 9; j++) {
            let key = String.fromCharCode(97 + j - 1) + rank;
            if (i === 8 && j === 0) Squares.push(<div key={key} className="square" />);
            else if (j === 0) Squares.push(<div key={key} className="square">{8 - i}</div>);
            else if (i === 8) Squares.push(<div key={key} className="square">{String.fromCharCode(65 + j - 1)}</div>);
            else {
                let piece = row[j - 1];

                Squares.push(
                    <Square
                        key={key}
                        pos={key}
                        color={isBlack ? "b" : "w"}
                        piece={piece}
                        possibleMoves={possibleMoves}
                        blackMove={blackMove}
                        setBlackMove={setBlackMove}
                        setPossibleMoves={setPossibleMoves}
                        gameState={gameState}
                        from={from}
                        moveTaken={moveTaken}
                        setMoveTaken={setMoveTaken}
                    />
                );
                isBlack = !isBlack;
            }
        }
    }

    return (
        <div className="chess-board">
            {Squares}
        </div>
    )
}

export default Board;