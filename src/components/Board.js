import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { apiRequest } from "../utils/ApiClient"
import { Tile } from "./Tile"
import { getAttacked, getCastling } from '../utils/Chess'
import Modal from 'react-bootstrap/Modal'

export function Board({ reversed = false }) {
    const [game, board, updateGame] = useGame()
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [high, setHigh] = useState([])
    const [showModal, setShowModal] = useState(false)

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
            const piece = board.inGameTiles[src].piece
            if (piece[1] === 'p' && ((piece[0] === 'w' && r === 8) || (piece[0] === 'b' && r === 1))) {
                setShowModal(true)
                return
            }

            apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src: src, dest: tile }, (error, data) => {
                if (!error && data) {
                    updateGame(data)
                }
            })
            return;
        }
        setSrc(tile)
        console.time()
        const att = getAttacked(board.inGameTiles, myColor, c, r)
        const cast = getCastling(board.inGameTiles, myColor, c, r)
        console.timeEnd()
        setHigh(att.concat(cast))

    }


    const promote = (p) => {
        setShowModal(false)
        const piece = board.inGameTiles[src].piece
        apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src: src, prom: p }, (error, data) => {
            if (!error && data) {
                updateGame(data)
            }
        })
    }

    return <>
        <Modal size='sm' show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Body>
                <div style={{ cursor: 'pointer', position: 'relative', width: '245px', margin: 'auto' }}>
                    {['q', 'r', 'b', 'n'].map(p => <div key={p} style={{ width: '60px', height: '60px', float: 'left', backgroundSize: '60px 60px', backgroundImage: `url('/assets/${myColor}${p}.svg')` }}
                        onClick={() => promote(p)} />
                    )}
                </div>
            </Modal.Body>
        </Modal>
        <table border='0' cellSpacing="0" cellPadding="0">
            <tbody>{rows.map((r) =>
                <tr key={r}>{
                    cols.map((c) => {
                        const tile = `${c}${r}`
                        return <td key={c}>
                            <Tile
                                key={tile}
                                col={c} row={r}
                                piece={board.inGameTiles[tile] && board.inGameTiles[tile].piece}
                                reversed={reversed}
                                selected={src && src === tile}
                                myTurn={myTurn}
                                myColor={myColor}
                                highlight={high.includes(tile)}
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