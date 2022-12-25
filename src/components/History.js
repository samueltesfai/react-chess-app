import { Chess } from "chess.js";
import { useRef } from "react";
import { useEffect } from "react";


function History(props) {

    const { gameState, setGameState, clear, moveTaken, setMoveTaken } = props;
    const gameLog = [];
    const bottom = useRef();


    const scrollBottom = () => {
        bottom.current?.scrollIntoView();
    }

    const resetGame = () => {
        if (gameState.turn() === 'b') return;
        clear.current = true;
        setMoveTaken(!moveTaken);
        setGameState(new Chess());
    }

    useEffect(() => {
        scrollBottom();
    });

    const undo = () => {
        if (gameState.turn() === 'b' || gameLog.length <= 1) return;
        gameState.undo();
        gameState.undo();
        clear.current = true;
        setMoveTaken(!moveTaken);

    }

    for (let i = 0; i < gameState.history().length; i++) {
        if (i % 2 === 0) {
            gameLog.push(<div key={`num:${i / 2 + 1}`} className="entry number">{i / 2 + 1}</div>)
        }
        gameLog.push(<div key={i} className="move entry">{gameState.history({ verbose: true })[i].san}</div>)
    }
    gameLog.push(<div key="end" ref={bottom} />)


    return (
        <div className="history">
            <div className="number-background" />
            <div className="line" />
            <div className="wrapper">
                <div className="moves">
                    {gameLog}
                </div>
            </div>
            <div className="buttons">
                <button onClick={undo}>Undo</button>
                <button onClick={resetGame}>Reset</button>
            </div>
        </div>
    )

}

export default History;