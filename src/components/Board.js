import { useState,useEffect, useRef } from "react";
import Square from "./Square"
import   * as F from "../Heuristics";
import Bot from "../Bot"


function Board(props) {

    const {gameState,moveTaken,setMoveTaken}=props;
    const [possibleMoves, setPossibleMoves] = useState([]);
    const [blackMove,setBlackMove]=useState([]);
    const gameBoard = gameState.board();
    const from=useRef('');
    const BlackBot=new Bot(F.materialHeuristic,gameState,'b',4);

    if(props.clear.current){
        blackMove.length=0;
        possibleMoves.length=0;
        from.current='';
        props.clear.current=false;
    }
    
    useEffect(()=>{
        
        if(gameState.turn()==='b'){
            setTimeout(()=>{
                setBlackMove(BlackBot.move());
                setMoveTaken(!moveTaken);
            },1500)
        }
        if(gameState.isGameOver()){

            let result;

            if(gameState.isCheckmate()){
                result=gameState.turn()==='b'? "White Wins!":"Black Wins!"
            }
            else result="Match Draw!";

            setTimeout(()=>{
                alert(result);
            },1500);
        }
    })


    const Squares = [];

    for (let i = 0; i < 9; i++) {
        let row = gameBoard[i];
        let isBlack = i % 2 === 0 ? false : true;
        let rank= (8 - i).toString();
        for (let j = 0; j < 9; j++) {
            let key = String.fromCharCode(97 + j - 1) +rank;
            if (i === 8 && j === 0) Squares.push(<div key={key} className="square"/>);
            else if (j === 0) Squares.push(<div key={key} className="square">{8 - i}</div>);
            else if (i === 8) Squares.push(<div key={key} className="square">{String.fromCharCode(65 + j - 1)}</div>);
            else {
                let piece = row[j-1];
            
                Squares.push(
                    <Square 
                    key={key}
                    pos={key} 
                    color={isBlack?"b":"w"} 
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