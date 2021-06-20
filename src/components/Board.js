import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { apiRequest } from "../utils/ApiClient"
import { Tile } from "./Tile"
import { getAttacked, getCastling, includes } from '../utils/Chess'
import Modal from 'react-bootstrap/Modal'

export function Board({ reversed = false }) {
    const [game, board, updateGame] = useGame()
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [high, setHigh] = useState([])
    const [castling, setCastling] = useState([])
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setSrc(null)
        setHigh([])
        setCastling([])
    }, [game, board])

    const myColor = user.id === game.whitePlayerId ? 'w' : 'b'
    const myTurn = myColor === 'w' ? game.movs.length % 2 === 0 : game.movs.length % 2 !== 0

    if (!game || !board) {
        return <></>
    }

    const rows = reversed ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0]
    const cols = reversed ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]

    const onSelect = (c, r) => {

        const castled = includes(castling, c, r)
        const highlighted = includes(high, c, r)

        if (highlighted || castled) {
            const piece = board.inGameTiles[src[1]][src[0]]
            if (piece && (piece[1] === 'p' && ((piece[0] === 'w' && r === 7) || (piece[0] === 'b' && r === 0)))) {
                setShowModal(true)
                return
            }

            apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src: src, dest: [c, r], cast: castled }, (error, data) => {
                if (!error && data) {
                    updateGame(data)
                }
            })
            return
        }
        setSrc([c, r])
        console.time()
        const att = getAttacked(board.inGameTiles, board.touched, myColor, c, r)
        const cast = getCastling(board.inGameTiles, board.touched, myColor, c, r)
        setHigh(att)
        setCastling(cast)
        console.timeEnd()
    }

    const promote = (p) => {
        setShowModal(false)
        const piece = board.inGameTiles[src[1]][src[0]]
        apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src: src, dest: [src[0], src[1] === 1 ? 0 : 7], prom: p }, (error, data) => {
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
                        const lm = board.turn > 0 && ((game.movs[board.turn - 1].sCol === c && game.movs[board.turn - 1].sRow === r) || (game.movs[board.turn - 1].dCol === c && game.movs[board.turn - 1].dRow === r))
                        return <td key={c}>
                            <Tile
                                key={`${c}${r}`}
                                col={c} row={r}
                                piece={board.inGameTiles[r][c]}
                                reversed={reversed}
                                selected={src && (src[0] === c && src[1] === r)}
                                myTurn={myTurn}
                                myColor={myColor}
                                highlight={includes(high, c, r) || includes(castling, c, r)}
                                lastMov={lm}
                                onSelect={() => onSelect(c, r)}
                            ></Tile>
                        </td>
                    }
                    )}
                </tr>)
            }
            </tbody>
        </table>
    </>
}