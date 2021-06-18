
export function Captured({ position, reversed, game, board }) {

    if (!game || !board) {
        return <></>
    }
    const white = (position === 'top' && reversed) || (position === 'bottom' && !reversed)
    const myTurn = (white && board.turn % 2 === 0) || (!white && board.turn % 2 !== 0)

    return <div className='mt-1'>
        <div style={{ fontWeight: (myTurn ? 'bold' : 'normal') }}>{!white ? game.blackPlayerName : game.whitePlayerName}</div>
        <div style={{ overflow: 'hidden', height: '30px' }}>
            {(!white ? board.whiteCaptured : board.blackCaptured).map(c =>
                <div key={c}
                    style={{ width: "30px", height: '30px', backgroundSize: '30px 30px', float: 'left', backgroundImage: `url('/assets/${c.slice(0, -1)}.svg')` }}>
                </div>
            )}
        </div>
    </div>
}