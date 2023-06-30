import { useRef } from "react";
import { useEffect } from "react";


function History(props) {

    const { gameStateRef, clear, undoTaken, setUndoTaken } = props;
    const gameLog = [];
    const bottom = useRef();


    const scrollBottom = () => {
        bottom.current?.scrollIntoView();
    }

    const resetGame = () => {
        clear.current = true;
        gameStateRef.current = null;
        setUndoTaken(!undoTaken);
    }

    useEffect(() => {
        scrollBottom();
    });

    const undo = () => {
        if (gameLog.length <= 1) return;
        gameStateRef.current.undo(true);
        gameStateRef.current.undo(true);
        clear.current = true;
        setUndoTaken(!undoTaken);

    }

    for (let i = 0; i < gameStateRef.current.history().length; i++) {
        if (i % 2 === 0) {
            gameLog.push(<div key={`num:${i / 2 + 1}`} className="entry number">{i / 2 + 1}</div>)
        }
        gameLog.push(<div key={i} className="move entry">{gameStateRef.current.history({ verbose: true })[i].san}</div>)
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
                <button onClick={undo} disabled={gameStateRef.current.turn() === 'b' && !gameStateRef.current.isGameOver()}>Undo</button>
                <button onClick={resetGame} disabled={gameStateRef.current.turn() === 'b' && !gameStateRef.current.isGameOver()}>Reset</button>
            </div>
        </div>
    )

}

export default History;