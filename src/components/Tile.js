export function Tile({ col, row, piece = null, reversed, src, myTurn, myColor, highlights, lastMov, onSelect = a => a }) {
    const tile = `${col}${row}`
    const selectable = myTurn && ((piece && myColor === piece[0]) || highlights.includes(tile))
    const black = col % 2 !== 0 ? row % 2 !== 0 : row % 2 === 0;
    const letters = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' }

    const tl = {
        position: "absolute", userSelect: 'none', width: '25px', height: '25px',
        top: '0px', left: '0px',
    }

    const br = {
        position: "absolute", userSelect: 'none', width: '25px', height: '25px',
        bottom: '0px', right: '0px',
        textAlign: 'right'
    }

    const onClick = () => {
        if (selectable) {
            onSelect();
        }
    }

    const selected = src && src === tile
    const bgColor = black ? '#b3e5fc' : '#ffffff'
    const high = highlights.includes(tile)
    const last = lastMov && (lastMov.dest === tile || lastMov.orig === tile)

    const highStyle = high ? (piece ?
        { position: "absolute", width: "60px", height: '60px', backgroundSize: '55px 55px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url('/assets/circle.svg')` } :
        { position: "absolute", width: "60px", height: '60px', backgroundSize: '15px 15px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url('/assets/dot.svg')` })
        : null

    return <>
        <div style={{ cursor: selectable ? 'pointer' : 'default', width: '60px', height: '60px', position: 'relative', backgroundColor: bgColor }}
            onClick={onClick}>
            {col === (reversed ? 8 : 1) ? <div style={{ ...tl, color: black ? '#FFFFFF' : '#b3e5fc' }}>{row}</div> : ''}
            {row === (reversed ? 8 : 1) ? <div style={{ ...br, color: black ? '#FFFFFF' : '#b3e5fc' }}>{letters[col]}</div> : ''}
            {selected &&
                <div style={{ position: "absolute", width: "60px", height: '60px', backgroundRepeat: 'repeat', backgroundImage: `url('/assets/mask.png')` }} />
            }
            {last &&
                <div style={{ position: "absolute", width: "60px", height: '60px', backgroundRepeat: 'repeat', backgroundImage: `url('/assets/mask.png')` }} />
            }
            {high && <div style={highStyle} />}
            {piece &&
                <div style={{ position: "absolute", margin: "5px", width: "50px", height: '50px', backgroundSize: '50px 50px', backgroundImage: `url('/assets/${piece.slice(0, -1)}.svg')` }}>
                </div>
            }
            {false && <div style={{ position: "absolute", left: '20px', color: '#FF0000' }}>{tile}</div>}
            
        </div>

    </>
}