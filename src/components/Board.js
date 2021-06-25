import { useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { apiRequest } from "../utils/ApiClient"
import { Tile } from "./Tile"
import { getAttacked, getCastling, includes } from '../utils/Chess'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'

const letters = { 1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h' }

export function Board({ reversed = false }) {
    const [game, board, updateGame] = useGame()
    const [user] = useAuth()
    const [src, setSrc] = useState(null)
    const [dest, setDest] = useState(null)
    const [high, setHigh] = useState([])
    const [castling, setCastling] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(null)

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
                setDest([c, r])
                setShowModal(true)
                return
            }

            apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src: src, dest: [c, r], cast: castled }, (error, data) => {
                if (error) {
                    setError(error || "Error inesperado")
                } else {
                    setError(null)
                    updateGame(data)
                }
            })
            return
        }
        setSrc([c, r])
        setDest(null)
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
        apiRequest(`/v1/games/${game.id}/moves`, 'post', user.api_key, { piece, src, dest, prom: p }, (error, data) => {
            if (!error && data) {
                updateGame(data)
            }
        })
    }

    const { innerWidth: width, innerHeight: height } = window
    const th = Math.ceil((parseInt((height - 220) / 8)) / window.devicePixelRatio) * window.devicePixelRatio

    const blackColor = '#79b8ab'
    const whiteColor = '#f7f4e7'

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

        <div style={{
            color: blackColor,
            textAlign: "center",
            position: 'relative',
            width: `${(th * 8) + 60}px`, height: `${(th * 8) + 60}px`,
            backgroundColor: `${whiteColor}`,
            userSelect: 'none'
        }}>


            <div style={{ position: 'absolute', left: '30px' }}>{cols.map(c => <div key={`t${c}`} style={{  float: "left", width: `${th}px`, height: '26px' }}>{letters[c + 1]}</div>)}</div>
            <div style={{ position: 'absolute', left: '30px', bottom: '0px' }}>{cols.map(c => <div key={`b${c}`} style={{ float: "left", textAlign: 'center', width: `${th}px`, height: '26px' }}>{letters[c + 1]}</div>)}</div>

            <div style={{ position: 'absolute', top: `${30 + (th * 0.3)}px`, right: '0px' }}>{rows.map(r => <div key={`r${r}`} style={{ height: `${th}px`, width: '26px' }}>{r + 1}</div>)}</div>
            <div style={{ position: 'absolute', top: `${30 + (th * 0.3)}px`, left: '0px' }}>{rows.map(r => <div key={`l${r}`} style={{ height: `${th}px`, width: '26px' }}>{r + 1}</div>)}</div>

            <div style={{ position: 'absolute', left: '26px', top: '26px', backgroundColor: blackColor, width: `${(th * 8) + 8}px`, height: `${(th * 8) + 8}px` }}>
                <div style={{ width: `${th * 8}px`, height: `${th * 8}px`, padding: '4px' }}>
                    {rows.map((r) =>
                        <div key={r} style={{ position: 'relative', width: `${th * 8}px`, height: `${th}px` }}>{
                            cols.map((c) => {
                                const lm = board.turn > 0 && ((game.movs[board.turn - 1].sCol === c && game.movs[board.turn - 1].sRow === r) || (game.movs[board.turn - 1].dCol === c && game.movs[board.turn - 1].dRow === r))
                                return <Tile
                                    key={c}
                                    blackColor={blackColor}
                                    whiteColor={whiteColor}
                                    col={c} row={r}
                                    piece={board.inGameTiles[r][c]}
                                    reversed={reversed}
                                    selected={src && (src[0] === c && src[1] === r)}
                                    myTurn={myTurn}
                                    myColor={myColor}
                                    highlight={includes(high, c, r) || includes(castling, c, r)}
                                    lastMov={lm}
                                    onSelect={() => onSelect(c, r)}
                                    size={th}
                                ></Tile>
                            }
                            )}
                        </div>)
                    }</div>
            </div>
        </div>

        {(error && <Alert variant='danger'>
            {error}
        </Alert>)}
    </>
}