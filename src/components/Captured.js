import { useAuth } from "../providers/ProvideAuth"
import { getProfilePictureUrl } from '../controllers/user-controller'
import { useEffect, useState } from "react"

export function Captured({ position, reversed = false, game, board }) {
    const { user } = useAuth()
    const [url, setUrl] = useState()
    let white, myTurn, playerName, pieces
    if (game && board) {
        white = (position === 'top' && reversed) || (position === 'bottom' && !reversed)
        myTurn = (white && board.turn % 2 === 0) || (!white && board.turn % 2 !== 0)
        playerName = !white ? game.blackPlayerName : game.whitePlayerName;
        pieces = !white ? board.whiteCaptured : board.blackCaptured
    } else {
        white = position !== 'top'
        myTurn = position !== 'top'
        playerName = position === 'top' ? 'Oponente' : user.username
        pieces = []

    }


    useEffect(() => {
        if (game && board) {
        } else {
            if (position === 'bottom') {
                getProfilePictureUrl(user).then(setUrl)
            } else {
                getProfilePictureUrl({ id: null, hasPicture: false, api_key: user.api_key }).then(setUrl)
            }
        }
    }, [game, board, user, position])

    return <div className='mt-1'>

        <div style={{ overflow: "hidden", position: "relative" }}>
            <img alt="" width='50' height='50' className='mr-2' src={url} style={{ borderRadius: '15%', float: "left" }} />
            <div style={{ float: "left" }} >
                <div style={{ fontWeight: (myTurn ? 'bold' : 'normal') }}>{playerName}</div>
                <div style={{ overflow: 'hidden', height: '30px' }}>
                    {pieces.map(c =>
                        <div key={c}
                            style={{ width: "30px", height: '30px', backgroundSize: '30px 30px', float: 'left', backgroundImage: `url('/assets/${c.slice(0, -1)}.svg')` }}>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
}