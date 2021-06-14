import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { apiRequest } from "../utils/ApiClient"
import { Tile } from "./Tile"
import { getBoard, getAttacked, getCastling } from '../utils/Chess'

export function Board({ reversed = false }) {
    const [game, setGame] = useGame()
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [high, setHigh] = useState([])
    const [board, setBoard] = useState(null)

    useEffect(() => {
        setSrc(null)
        setHigh([])
        setBoard(getBoard(game.pieces, game.turn))
    }, [game])

    const myColor = user.id === game.whitePlayerId ? 'w' : 'b'
    const myTurn = game.current[0] === myColor;

    if (!game || !board) {
        return <></>
    }

    const rows = reversed ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
    const cols = reversed ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]

    const onSelect = (c, r) => {
        const tile = `${c}${r}`
        if (high.includes(tile)) {
            //move
            apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece: board[src].piece, src: src, dest: tile }, (error, data) => {
                if (!error && data) {
                    setGame(data)
                }
            })
            return;
        }
        setSrc(tile)
        const att = getAttacked(board, myColor, c, r)
        const cast = getCastling(board, myColor, c, r)
        setHigh(att.concat(cast))
    }

    return <>
        <table border='0' cellSpacing="0" cellPadding="0">
            <tbody>{rows.map((r) =>
                <tr key={r}>{
                    cols.map((c) => {
                        return <td key={c}>
                            <Tile key={`${c}${r}`} col={c} row={r} piece={board[`${c}${r}`] && board[`${c}${r}`].piece} reversed={reversed}
                                src={src} myTurn={myTurn} myColor={myColor} highlights={high}
                                onSelect={() => onSelect(c, r)}
                            >
                            </Tile>
                        </td>
                    }
                    )}
                </tr>)
            }
            </tbody>
        </table>
    </>
}