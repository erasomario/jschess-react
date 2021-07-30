import { useGame } from "../../providers/ProvideGame"
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './moves.css'
import getMoveData from "./MoveUtils"
import { FaPlus, FaClipboardList } from "react-icons/fa";
import { useAuth } from "../../providers/ProvideAuth"
import { Alert, Button } from "react-bootstrap"
import { rematch } from "../../controllers/game-client"

export default function Moves({ style, onNewGame = a => a }) {
    const { user } = useAuth()
    const scrollRef = useRef()
    const { game, updateTurn } = useGame()
    const data = useMemo(() => getMoveData(game, user), [game, user])
    const board = game ? game.board : null
    const [error, setError] = useState()

    useLayoutEffect(() => {
        if (scrollRef.current) {
            setTimeout(function () {
                scrollRef?.current?.scrollIntoView({ block: "nearest", behavior: "auto" })
            }, 0)
        }
    }, [data])

    const prev = () => updateTurn(board.turn - 1)
    const next = () => updateTurn(board.turn + 1)
    const beg = () => updateTurn(1)
    const end = () => updateTurn(game.movs.length)

    function MoveCell({ mov }) {
        if (!mov) {
            return null
        } else if (board.turn !== mov.turn) {
            return <span className="cell" onClick={() => updateTurn(mov.turn)}>
                {mov.label}</span>
        } else {
            return <span className="selectedCell">
                <span>{mov.label}</span>
            </span>
        }
    }

    const callRematch = () => {
        rematch(user, game)
            .then(onNewGame)
            .catch(e => setError(e.message))
    }

    return <div style={{ width: '17em', fontSize: '2.1vh' }}>
        <div className="movRow">
            <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>#</div>
            <div className="headerPawn" style={{ backgroundImage: `url('/assets/wp.svg')` }} />
            <div className="headerPawn" style={{ backgroundImage: `url('/assets/bp.svg')` }} />
        </div>
        {data.show === "noGame" &&
            <div className="instructionsCard" style={{ height: style.height }}>
                <div><b>Bienvenido</b></div>
                <div>Puede iniciar un juego contra amigos o contra el computador en <FaPlus />, o consultar sus partidas en curso y pasadas en <FaClipboardList />.</div>
            </div>
        }
        {data.show === "noMovs" &&
            <div className="instructionsCard" style={{ height: style.height }}>
                <div><b>Juegan las {data.myColor === "w" ? "Blancas" : "Negras"}</b></div>
                <div>{data.myColor === "w" ? "Es su turno para iniciar" : "Es el turno de su oponente para iniciar"}</div>
            </div>
        }
        {data.show === "movs" && <SimpleBar style={{ height: style.height, fontSize: "0.9em" }}>
            {data.matrix.map((r, i) => {
                return <div
                    ref={data.selectedRow === i ? scrollRef : null}
                    className="movRow"
                    style={{ backgroundColor: (i % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : "") }} key={i}>
                    <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>{i + 1}</div>
                    <MoveCell mov={r[0]} />
                    <MoveCell mov={r[1]} />
                </div>
            })}
            {data.winLabel &&
                <div className="movRow"
                    ref={data.selectedRow === data.matrix.length - 1 && game?.result ? scrollRef : null}
                    style={{ padding: "0.75em", display: "flex", flexDirection: "column", alignItems: "center", height: "auto", backgroundColor: (data.matrix.length % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : "") }} >
                    <div style={{ fontWeight: "bold" }}>{data.winLabel}</div>
                    {data.winDetail && <div style={{ fontSize: "0.8em", textAlign: "center" }}>{data.winDetail}</div>}
                    <Button onClick={callRematch} style={{ fontSize: "1em", textAlign: "center", margin: "0", padding: "0" }} variant="link">Revancha</Button>
                </div>}
        </SimpleBar>
        }
        <div style={{ display: "flex", marginTop: "1em" }}>
            <button className="movBtn" onClick={beg} disabled={data.prevBtnDisabled} >
                <FaAngleDoubleLeft className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={prev} disabled={data.prevBtnDisabled}  >
                <FaAngleLeft className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={next} disabled={data.nextBtnDisabled}  >
                <FaAngleRight className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={end} disabled={data.nextBtnDisabled}  >
                <FaAngleDoubleRight className="movBtnIcon" />
            </button>
        </div>
        {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
    </div >
}