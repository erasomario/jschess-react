import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { apiRequest } from "../utils/ApiClient"
import { Tile } from "./Tile"
import { getAttacked, getCastling } from '../utils/Chess'

export function Board({ reversed = false }) {
    const [game, board, updateGame] = useGame()
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [high, setHigh] = useState([])

    useEffect(() => {
        setSrc(null)
        setHigh([])
    }, [game, board])

    const myColor = user.id === game.whitePlayerId ? 'w' : 'b'
    const myTurn = myColor === 'w' ? game.turn % 2 === 0 : game.turn % 2 !== 0

    if (!game || !board) {
        return <></>
    }

    const rows = reversed ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]
    const cols = reversed ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]

    const onSelect = (c, r) => {
        const tile = `${c}${r}`
        if (high.includes(tile)) {
            //move
            apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece: board.inGameTiles[src].piece, src: src, dest: tile }, (error, data) => {
                if (!error && data) {
                    updateGame(data)
                }
            })
            return;
        }
        setSrc(tile)
        const att = getAttacked(board.inGameTiles, myColor, c, r)
        const cast = getCastling(board.inGameTiles, myColor, c, r)
        setHigh(att.concat(cast))
    }

    return <>
        <table border='0' cellSpacing="0" cellPadding="0">
            <tbody>{rows.map((r) =>
                <tr key={r}>{
                    cols.map((c) => {
                        return <td key={c}>
                            <Tile
                                key={`${c}${r}`}
                                col={c} row={r}
                                piece={board.inGameTiles[`${c}${r}`] && board.inGameTiles[`${c}${r}`].piece}
                                reversed={reversed}
                                src={src}
                                myTurn={myTurn}
                                myColor={myColor}
                                highlights={high}
                                lastMov={board.lastMov}
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