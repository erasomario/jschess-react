import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import { Tile } from "./Tile"
import { getAttacked, getCastling, includes, getStartBoard, getPieces } from "../../utils/Chess"
import Modal from "react-bootstrap/Modal"
import { createMove, createMoveSocket } from "../../clients/game-client"
import { animate } from "./PieceAnimation"
import { toast } from "react-toastify"
import { mix } from "../../utils/Colors"
import { FaCog } from "react-icons/fa"
import { colors } from "./BoardOptionsDialog"
import { useSocket } from "../../providers/ProvideSocket"

const letters = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g", 8: "h" }
const startBoard = getStartBoard()

export function Board({ reversed = false, size, style, showCfgButton, options, onOptionsClicked }) {
    console.log("board repaint")
    const { emit } = useSocket()
    const animPiece = useRef()
    const { game, lastTurn } = useGame()
    const { user } = useAuth()
    const [src, setSrc] = useState(null)
    const [dest, setDest] = useState(null)
    const [high, setHigh] = useState([])
    const [castling, setCastling] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [animating, setAnimating] = useState(null)
    const th = (options?.coords === "out_opaque" || options?.coords === "out_trans") ? (size * 0.92) / 8 : size / 8
    const colorTheme = useMemo(() => colors[options?.colors], [options?.colors])
    const lastSound = useRef(0)

    useLayoutEffect(() => {
        setSrc()
        setHigh()
        setCastling()
        if (!game) {
            return
        }
        let sCol, sRow, dCol, dRow
        if (lastTurn && lastTurn - 1 === game?.board?.turn) {
            //backward
            const m = game.movs[lastTurn - 1]
            sCol = m.dCol
            sRow = m.dRow
            dCol = m.sCol
            dRow = m.sRow
        } else {
            //forward
            const m = game.movs[game?.board?.turn - 1]
            sCol = m.sCol
            sRow = m.sRow
            dCol = m.dCol
            dRow = m.dRow            
        }

        const piece = game.board.inGameTiles[dRow][dCol]
        setAnimating(piece)
        animate(animPiece.current, piece, reversed, th, sCol, sRow, dCol, dRow, () => {
            setAnimating(null)
            if (options.sounds) {
                let newNum
                do {
                    newNum = Math.floor(Math.random() * 4)
                } while (newNum === lastSound.current)
                lastSound.current = newNum
                const snd = document.getElementById("pieceSound" + newNum)
                if (snd) {
                    snd.volume = 1
                    snd.play().catch(e => e)
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game?.board?.turn, reversed])

    if (!options) {
        return <></>
    }

    const myColor = game ? (user.id === game.whiteId ? "w" : (user.id === game.blackId ? "b" : null)) : null
    const myTurn = game && myColor ? (myColor === "w" ? game.movs.length % 2 === 0 : game.movs.length % 2 !== 0) : false

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
            if (piece && (piece[1] === "p" && ((piece[0] === "w" && r === 7) || (piece[0] === "b" && r === 0)))) {
                setDest([c, r])
                setShowModal(true)
                return
            }
            console.log("Mov Creation", Date.now());
            createMoveSocket(emit, game.id, piece, src, [c, r])
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
            .catch(e => toast.error(e.message))
    }

    const TitlesRow = ({ style }) => {
        return <div style={{ display: "flex", flexDirection: "row", ...style }}>
            {cols.map(c => <div key={`b${c}`} style={{ textAlign: "center", width: `${th}px` }}>{letters[c + 1].toUpperCase()}</div>)}
        </div>
    }

    const TitlesCol = ({ style }) => {
        return <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", ...style }}>
            <div style={{ height: `${th * 0.3}px` }}></div>
            {rows.map((r, i) => <div key={`r${r}`} style={{ height: `${i === 7 ? th * 0.7 : th}px`, verticalAlign: "center" }}>{r + 1}</div>)}
        </div>
    }

    const InnerBoard = () => {
        return <>
            {showCfgButton && <div onClick={onOptionsClicked} style={{ color: "rgba(80, 80, 80, 1)", position: "absolute", width: "2em", height: "2em", right: "-2.4em", top: "0.3em", cursor: "pointer" }}>
                <FaCog style={{ width: "2em", height: "2em" }} />
            </div>}
            <div style={{ boxShadow: `0px 0px 7px ${mix(colorTheme.primary, "#000000", 0.3)}`, position: "relative", display: "flex", flexDirection: "column", gridColumn: "2/3", gridRow: "2/3" }}>
                {rows.map((r) =>
                    <div key={r} style={{ display: "flex", flexDirection: "row" }}>{
                        cols.map((c) => {
                            const lm = (game && game.board.turn > 0) && ((game.movs[game.board.turn - 1].sCol === c && game.movs[game.board.turn - 1].sRow === r) || (game.movs[game.board.turn - 1].dCol === c && game.movs[game.board.turn - 1].dRow === r))
                            let piece = (game ? game.board.inGameTiles : startBoard)[r][c]
                            if (animating === piece) {
                                piece = null
                            }
                            return <Tile
                                key={c}
                                colors={colorTheme}
                                col={c} row={r}
                                piece={piece}
                                reversed={reversed}
                                selected={src && (src[0] === c && src[1] === r)}
                                myTurn={myTurn && !game.result && game.board.turn === game.movs.length}
                                myColor={myColor}
                                highlight={includes(high, c, r) || includes(castling, c, r)}
                                lastMov={lm}
                                onSelect={() => onSelect(c, r)}
                                size={th}
                                showCoords={options.coords === "in"}
                            ></Tile>
                        }
                        )}
                    </div>
                )}
                <div ref={animPiece}
                    style={{
                        position: "absolute", top: "0px", left: "0px",
                        backgroundPosition: "bottom right",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${th}px ${th}px`
                    }}>
                </div>
            </div>
        </>
    }

    let borderStyle
    const baseStyle = {
        fontSize: `${(size * 0.04) / 2}px`,
        userSelect: "none",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: "0",
        position: "relative",
        ...style
    }

    switch (options.coords) {
        case "out_opaque":
            borderStyle = {
                color: mix(colorTheme.primary, "#FFFFFF", 0.7),
                backgroundColor: mix(colorTheme.primary, "#000000", 0.1),
                borderRadius: "1.5%",
                ...baseStyle
            }
            break;
        case "out_trans":
            borderStyle = {
                color: mix(colorTheme.primary, "#000000", 0.2),
                ...baseStyle
            }
            break;
        default:
            borderStyle = {
                ...baseStyle
            }
            break;
    }

    return <>

        <Modal size="sm" show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Body>
                <div style={{ cursor: "pointer", position: "relative", width: "245px", margin: "auto" }}>
                    {["q", "r", "b", "n"].map(p => <div key={p} style={{ width: "60px", height: "60px", float: "left", backgroundSize: "60px 60px", backgroundImage: `url("${process.env.PUBLIC_URL}/assets/${myColor}${p}.svg")` }}
                        onClick={() => promote(p)} />
                    )}
                </div>
            </Modal.Body>
        </Modal>
        {options.sounds && [...new Array(4)].map((s, i) => <audio key={i} id={"pieceSound" + i}>
            <source src={`${process.env.PUBLIC_URL}/assets/sounds/piece${i}.ogg`} type="audio/ogg" />
            <source src={`${process.env.PUBLIC_URL}/assets/sounds/piece${i}.mp3`} type="audio/mp3" />
        </audio>)}

        <div style={borderStyle}>
            {InnerBoard()}
            {(options.coords === "out_opaque" || options.coords === "out_trans") && <>
                <TitlesRow style={{ gridColumn: "2/3", gridRow: "1/2", alignItems: "flex-end", marginBottom: "0.2em" }}></TitlesRow>
                <TitlesRow style={{ gridColumn: "2/3", gridRow: "3/4", alignItems: "flex-start", marginTop: "0.2em" }}></TitlesRow>
                <TitlesCol style={{ gridColumn: "1/2", gridRow: "2/3", alignItems: "flex-end", marginRight: "0.5em" }}></TitlesCol>
                <TitlesCol style={{ gridColumn: "3/4", gridRow: "2/3", alignItems: "flex-start", marginLeft: "0.5em" }}></TitlesCol>
            </>
            }
        </div>
    </>
}