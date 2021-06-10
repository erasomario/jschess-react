export function Tile({ col, row, piece = null }) {

    const black = (col === 'a' || col === 'c' || col === 'e' || col === 'g') ? row % 2 !== 0 : row % 2 === 0;



    return <>
        <div style={{ width: '60px', height: '60px', position: 'relative', backgroundColor: black ? '#b3e5fc' : '' }}>
            {piece ?
                <div style={{ position: "absolute", margin: "5px", width: "50px" }}>
                    <img width={50} src={`/assets/${piece.slice(0, -1)}.svg`}></img>
                </div> : ''
            }
            {col === 'a' ? <div style={{ position: "absolute", top: "0px", left: '0px', verticalAlign: "top" }}>{row}</div> : ''}
            {row === 1 ? <div style={{ position: "absolute", bottom: "0px", right: '0px', verticalAlign: "top" }}>{col}</div> : ''}
        </div>

    </>
}