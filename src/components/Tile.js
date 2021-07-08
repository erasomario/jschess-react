
export function Tile({
    col,
    row,
    piece = null,
    reversed,
    selected,
    myTurn,
    myColor,
    highlight,
    lastMov,
    onSelect = a => a,
    blackColor,
    whiteColor,
    size,
    showCoords,
}) {
    const tile = `${col}${row}`
    const selectable = myTurn && ((piece && myColor === piece[0]) || highlight)
    const black = col % 2 !== 0 ? row % 2 !== 0 : row % 2 === 0;
    const letters = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' }

    const tl = {
        textAlign: "left",
        position: "absolute",
        top: '0px', left: '3%',
        fontSize: `${size * 0.22}px`
    }

    const br = {
        textAlign: "right",
        position: "absolute",
        bottom: '0px', right: '3%',
        fontSize: `${size * 0.22}px`
    }

    const onClick = () => {
        if (selectable) {
            onSelect();
        }
    }

    //const selected = 

    const bgColor = black ? blackColor : whiteColor
    const high = highlight
    const pieceSize = parseInt(size * 0.95)

    const highStyle = high ? (piece ?
        { position: "absolute", width: `${size}px`, height: `${size}px`, backgroundSize: `${size * 0.9}px ${size * 0.9}px`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url('/assets/circle.svg')` } :
        { position: "absolute", width: `${size}px`, height: `${size}px`, backgroundSize: `${size * 0.3}px ${size * 0.3}px`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url('/assets/dot.svg')` })
        : null

    //console.log(size, pieceMargin, pieceSize);

    return <>
        <div style={{ cursor: selectable ? 'pointer' : 'default', width: `${size}px`, height: `${size}px`, position: 'relative', backgroundColor: bgColor, float: 'left' }}
            onClick={onClick}>
            {showCoords && col === (reversed ? 7 : 0) ? <div style={{ ...tl, color: black ? whiteColor : blackColor }}>{row + 1}</div> : ''}
            {showCoords && row === (reversed ? 7 : 0) ? <div style={{ ...br, color: black ? whiteColor : blackColor }}>{letters[col + 1]}</div> : ''}
            {selected &&
                <div style={{ position: "absolute", width: `${size}px`, height: `${size}px`, opacity: "0.25", backgroundColor: '#2196F3' }} />
            }
            {lastMov &&
                <div style={{ position: "absolute", width: `${size}px`, height: `${size}px`, opacity: "0.25", backgroundColor: '#2196F3' }} />
            }
            {high && <div style={highStyle} />}
            {piece &&
                <div style={{ position: "absolute", width: `${size}px`, height: `${size}px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `${pieceSize}px ${pieceSize}px`, backgroundImage: `url('/assets/${piece.slice(0, -1)}.svg')` }}>
                </div>
            }
            {false && <div style={{ position: "absolute", left: '20px', color: '#FF0000' }}>{tile}</div>}
        </div>
    </>
}