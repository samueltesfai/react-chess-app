import './App.css';
import Board from "./components/Board"
import History from './components/History';
import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import GameState from './GameState';
import Bot from "./Bot"

function App() {

  const [moveTaken, setMoveTaken] = useState(false); // used to trigger render when a move is taken
  const [undoTaken, setUndoTaken] = useState(false);
  const clear = useRef(false); // used to reset hooks back to default values
  const gameStateRef = useRef(null);
  const BlackBot = useRef(null);
  const initialRenderRef = useRef(true);

  if (BlackBot.current === null) {
    BlackBot.current = new Bot(gameStateRef.current, 'b', 3);
  }
  if (gameStateRef.current === null) {
    gameStateRef.current = new GameState(new Chess());
    BlackBot.current.gameState = gameStateRef.current;
  }

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;  // Set the flag to false after the first render
    }
    else {
      new Audio(`${process.env.PUBLIC_URL}/assets/move.mp3`).play();
    }
  }, [moveTaken])

  return (
    <div className="App">

      <Board
        gameState={gameStateRef.current}
        moveTaken={moveTaken}
        setMoveTaken={setMoveTaken}
        clear={clear}
        BlackBot={BlackBot}
      />

      <History
        gameStateRef={gameStateRef}
        clear={clear}
        undoTaken={undoTaken}
        setUndoTaken={setUndoTaken}
        BlackBot={BlackBot}
      />

    </div>
  );
}

export default App;