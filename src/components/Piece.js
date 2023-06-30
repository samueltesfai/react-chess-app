
function Piece(props){

    const type_name={
        r:'rook',
        p:'pawn',
        q:'queen',
        k:'king',
        n:'knight',
        b:'bishop'
    }
    const size='40';
    const path=`${process.env.PUBLIC_URL}/assets/${props.color}_${type_name[props.type]}_svg_withShadow.svg`;

    return (<img className="piece" src={path} alt='' width={size} height={size}/>)

}
export default Piece;