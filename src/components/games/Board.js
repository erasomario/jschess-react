import { useLayoutEffect, useState } from "react"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import { Tile } from "./Tile"
import { getAttacked, getCastling, includes, getStartBoard } from '../../utils/Chess'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import { createMove } from "../../controllers/game-client"

const letters = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' }
const startBoard = getStartBoard()

export function Board({ reversed = false, size }) {
    console.log("board repaint")
    const { game } = useGame()
    const { user } = useAuth()
    const [src, setSrc] = useState(null)
    const [dest, setDest] = useState(null)
    const [high, setHigh] = useState([])
    const [castling, setCastling] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(null)

    useLayoutEffect(() => {
        setSrc()
        setHigh()
        setCastling()
    }, [game?.board?.turn])

    const myColor = game ? (user.id === game.whiteId ? 'w' : 'b') : ''
    const myTurn = game ? (myColor === 'w' ? game.movs.length % 2 === 0 : game.movs.length % 2 !== 0) : false

    const rows = reversed ? [0, 1, 2, 3, 4, 5, 6, 7] : [7, 6, 5, 4, 3, 2, 1, 0]
    const cols = reversed ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]

    const onSelect = (c, r) => {
        if (game.result || game.board.turn !== game.movs.length) {
            return
        }

        const castled = includes(castling, c, r)
        const highlighted = includes(high, c, r)
        const board = game.board

        if (highlighted || castled) {
            const piece = board.inGameTiles[src[1]][src[0]]
            if (piece && (piece[1] === 'p' && ((piece[0] === 'w' && r === 7) || (piece[0] === 'b' && r === 0)))) {
                setDest([c, r])
                setShowModal(true)
                return
            }
            createMove(user.api_key, game.id, piece, src, [c, r])
                .then(() => setError(null))
                .catch(e => setError(e.message))
            return
        }
        setSrc([c, r])
        setDest(null)

        const att = getAttacked(board.inGameTiles, board.touched, myColor, c, r)
        const cast = getCastling(board.inGameTiles, board.touched, myColor, c, r)
        setHigh(att)
        setCastling(cast)
    }

    const promote = p => {
        setShowModal(false)
        const piece = game.board.inGameTiles[src[1]][src[0]]
        createMove(user.api_key, game.id, piece, src, dest, p)
            .then(() => setError(null))
            .catch(e => setError(e.message))
    }

    const coords = 'in'
    const th = size / 8
    const blackColor = '#ADC5CF'
    const whiteColor = '#F5F8F9'

    const innerBoard = () => {
        return <>
            {rows.map((r) =>
                <div key={r} style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>{
                        cols.map((c) => {
                            const lm = (game && game.board.turn > 0) && ((game.movs[game.board.turn - 1].sCol === c && game.movs[game.board.turn - 1].sRow === r) || (game.movs[game.board.turn - 1].dCol === c && game.movs[game.board.turn - 1].dRow === r))
                            return <Tile
                                key={c}
                                blackColor={blackColor}
                                whiteColor={whiteColor}
                                col={c} row={r}
                                piece={(game ? game.board.inGameTiles : startBoard)[r][c]}
                                reversed={reversed}
                                selected={src && (src[0] === c && src[1] === r)}
                                myTurn={myTurn && !game.result}
                                myColor={myColor}
                                highlight={includes(high, c, r) || includes(castling, c, r)}
                                lastMov={lm}
                                onSelect={() => onSelect(c, r)}
                                size={th}
                                showCoords={coords === 'in'}
                            ></Tile>
                        }
                        )}
                </div>
            )}
            {(error && <Alert variant='danger'>{error}</Alert>)}
        </>
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

        {coords === 'out' &&
            <div style={{
                color: blackColor,
                textAlign: "center",
                position: 'relative',
                width: `${(th * 8) + 60}px`, height: `${(th * 8) + 60}px`,
                backgroundColor: `${whiteColor}`,
                userSelect: 'none'
            }}>
                <div style={{ position: 'absolute', left: '30px' }}>{cols.map(c => <div key={`t${c}`} style={{ float: "left", width: `${th}px`, height: '26px' }}>{letters[c + 1]}</div>)}</div>
                <div style={{ position: 'absolute', left: '30px', bottom: '0px' }}>{cols.map(c => <div key={`b${c}`} style={{ float: "left", textAlign: 'center', width: `${th}px`, height: '26px' }}>{letters[c + 1]}</div>)}</div>
                <div style={{ position: 'absolute', top: `${30 + (th * 0.3)}px`, right: '0px' }}>{rows.map(r => <div key={`r${r}`} style={{ height: `${th}px`, width: '26px' }}>{r + 1}</div>)}</div>
                <div style={{ position: 'absolute', top: `${30 + (th * 0.3)}px`, left: '0px' }}>{rows.map(r => <div key={`l${r}`} style={{ height: `${th}px`, width: '26px' }}>{r + 1}</div>)}</div>
                <div style={{ position: 'absolute', left: '26px', top: '26px', backgroundColor: blackColor, width: `${(th * 8) + 8}px`, height: `${(th * 8) + 8}px` }}>
                    <div style={{ width: `${th * 8}px`, height: `${th * 8}px`, padding: '4px' }}>
                        {innerBoard()}
                    </div>
                </div>
            </div>}
        {coords !== 'out' &&
            <div style={{
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {innerBoard()}
            </div>
        }
    </>
}