import Piece from "./Piece"


function Square(props) {
    const pos = props.pos;
    const gameState = props.gameState;
    const from = props.from;
    const piece = props.piece;


    function handleClick() {

        if (from.current === pos) {
            from.current = '';
            props.setPossibleMoves([]);
        }
        else if (
            from.current === '' ||
            (gameState.move({ from: from.current, to: pos }, true) === null && //illegal
                gameState.move({ from: from.current, to: pos, promotion: 'q' }, true) === null) //queen promo move
        ) {

            let moves = gameState.moves({ square: pos, verbose: true });
            if (moves.length !== 0) {
                props.setPossibleMoves(moves);
                from.current = pos;
            }
        }
        else {
            from.current = '';
            props.setBlackMove([]);
            props.setPossibleMoves([]);
            props.setMoveTaken(!props.moveTaken);

        }
    }

    const [darkColor, lightColor, highlightColor, attackColor, checkColor, moveColor] = [
        "#582c2c",
        "#804c3c",
        '#ffb58a',
        '#ff4015',
        "#d62700",
        '#ffd575'
    ];

    let squareColor = props.color === "b" ? darkColor : lightColor;


    if (piece !== null &&
        piece.type === 'k' &&
        gameState.inCheck() &&
        piece.color === gameState.turn()) {

        squareColor = checkColor;

    }
    else {
        if (props.blackMove.indexOf(pos) >= 0) {
            squareColor = moveColor;
        }
        for (let move of props.possibleMoves) {
            if (pos === move.to) {
                squareColor = "captured" in move ? attackColor : highlightColor;
                break
            }
        }

    }

    return (
        <div
            className="square"
            style={{ backgroundColor: squareColor, border: '.1px solid #582c2c' }}
            onClick={handleClick}>
            {props.piece !== null && <Piece type={props.piece.type} color={props.piece.color} />}
        </div>
    )

}
export default Square;