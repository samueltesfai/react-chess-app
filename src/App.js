import './App.css';
import Board from "./components/Board"
import History from './components/History';
import { useRef, useState } from 'react';
import { Chess } from 'chess.js';

function App() {

  const [gameState,setGameState] = useState(new Chess());
  const [moveTaken, setMoveTaken]=useState(false);
  const clear=useRef(false);


  return (
    <div className="App">

      <Board
      gameState={gameState}
      moveTaken={moveTaken}
      setMoveTaken={setMoveTaken}
      clear={clear}
      />

      <History
      gameState={gameState}
      clear={clear}
      moveTaken={moveTaken}
      setMoveTaken={setMoveTaken}
      setGameState={setGameState}
      />

    </div>
  );
}

export default App;
