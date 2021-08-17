import { useGame } from "../../providers/ProvideGame"
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './moves.scss'
import getMoveData from "./MoveUtils"
import { useAuth } from "../../providers/ProvideAuth"
import { Alert, Button } from "react-bootstrap"
import { rematch } from "../../clients/game-client"
import UserButton from "../menuButtons/UserButton"
import { useTranslation } from "react-i18next"

export default function Moves({ style, onNewGame = a => a, onEditClicked = a => a, compact = false }) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const scrollRef = useRef()
    const { game, updateTurn } = useGame()
    const data = useMemo(() => getMoveData(game, user, t), [game, user, t])
    const board = game ? game.board : null
    const [error, setError] = useState()

    useLayoutEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef?.current?.scrollIntoView({ block: "nearest", behavior: "auto" })
            }, 0)
        }
    })

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

    return <div style={{ display: "flex", flexDirection: "column", width: (compact ? "100%" : "17em"), fontSize: '2.1vh' }}>
        {!compact && <>
            <UserButton style={{ alignSelf: "flex-end" }} onEditClicked={onEditClicked} />
            <div className="movRow">
                {data.show === "movs" && <>
                    <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>&nbsp;</div>
                    <div className="headerPawn" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/wp.svg')` }} />
                    <div className="headerPawn" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/bp.svg')` }} />
                </>}
            </div>
            {data.show === "noGame" &&
                <div className="instructionsCard" style={{ height: style.height, backgroundImage: `url('${process.env.PUBLIC_URL}/assets/pawn.jpg')`, }}>
                    <div className="Overlay"></div>
                    <div className="Content" >
                        <p className="Title">{t("welcome")}</p>
                        <p>{t("you can play or watch live games")}</p>
                    </div>
                </div>
            }
            {data.show === "noMovs" &&
                <div className="instructionsCard" style={{ height: style.height, backgroundImage: `url('${process.env.PUBLIC_URL}/assets/pawn.jpg')`, }}>
                    <div className="Overlay"></div>
                    <div className="Content" >
                        <p className="Title">{t("white plays")}</p>
                        <p><div>{data.myColor === "w" ? t("it's your turn to start") : t("it's {{white}}'s turn to start", { white: game?.whiteName })}</div></p>
                    </div>
                </div>
            }
            {data.show === "movs" && <SimpleBar style={{ height: style.height, fontSize: "0.9em" }}>
                {data.matrix.map((r, i) => {
                    return <div
                        ref={data.selectedRow === i ? scrollRef : null}
                        className={"movRow" + (i % 2 === 0 ? " movRowAlt" : "")}
                        key={i}>
                        <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>{i + 1}</div>
                        <MoveCell mov={r[0]} />
                        <MoveCell mov={r[1]} />
                    </div>
                })}
                {data.winLabel &&
                    <div className={`endGameCard ${data.matrix.length % 2 === 0 ? "movRowAlt" : ""}`}
                        ref={data.selectedRow === data.matrix.length - 1 && game?.result ? scrollRef : null}>
                        <div style={{ fontWeight: "bold" }}>{data.winLabel}</div>
                        {data.winDetail && <div style={{ fontSize: "0.8em", textAlign: "center" }}>{data.winDetail}</div>}
                        {([game?.whiteId, game?.blackId].includes(user?.id)) &&
                            <Button onClick={callRematch} style={{ fontSize: "1em", textAlign: "center", margin: "0", padding: "0" }} variant="link">{t("rematch")}</Button>}
                    </div>}
            </SimpleBar>
            }
        </>}
        {data.show === "movs" && <div style={(compact ? { display: "flex" } : { display: "flex", marginTop: "1em" })}>
            {!compact && <button className="movBtn" onClick={beg} disabled={data.prevBtnDisabled} >
                <FaAngleDoubleLeft className="movBtnIcon" />
            </button>}
            <button className="movBtn" onClick={prev} disabled={data.prevBtnDisabled}  >
                <FaAngleLeft className="movBtnIcon" />
            </button>
            {compact && <button
                style={{ color: "white", width: "5em", paddingTop: "0.4em" }}
                className="movBtn" disabled={!data.lastMovLabel}  >
                {data.lastMovLabel}
            </button>}
            <button className="movBtn" onClick={next} disabled={data.nextBtnDisabled}  >
                <FaAngleRight className="movBtnIcon" />
            </button>
            {!compact && <button className="movBtn" onClick={end} disabled={data.nextBtnDisabled}  >
                <FaAngleDoubleRight className="movBtnIcon" />
            </button>}
        </div>}
        {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
    </div >
}