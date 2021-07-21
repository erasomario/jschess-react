import { useGame } from "../../providers/ProvideGame"
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { useCallback, useMemo } from "react"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './moves.css'
import getMoveData from "./MoveUtils"

export default function Moves() {
    const { game, updateTurn } = useGame()
    const data = useMemo(() => getMoveData(game), [game])
    const board = game ? game.board : null
    const sc = useCallback(node => {
        node?.scrollIntoView({ block: "nearest", behavior: "auto" })
    }, [])

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

    return <div style={{ width: '17em', fontSize: '2.1vh' }}>
        <div className="movRow">
            <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>#</div>
            <div className="pawn" style={{ backgroundImage: `url('/assets/wp.svg')` }} />
            <div className="pawn" style={{ backgroundImage: `url('/assets/bp.svg')` }} />
        </div>
        <SimpleBar style={{ height: "22em" }}>
            {data.matrix.map((r, i) => {
                return <div
                    ref={(r[0].turn === game.board.turn || r[1]?.turn === game.board.turn) ? sc : null}
                    className="movRow"
                    style={{ backgroundColor: (i % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : "") }} key={i}>
                    <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>{i + 1}</div>
                    <MoveCell mov={r[0]} />
                    <MoveCell mov={r[1]} />
                </div>
            })}
            {data.winLabel &&
                <div className="movRow"
                    style={{padding: "0.75em", display: "flex", flexDirection: "column", alignItems: "center", height: "auto", backgroundColor: (data.matrix.length % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : "") }} >
                    <div style={{ fontWeight: "bold" }}>{data.winLabel}</div>
                    {data.winDetail && <div style={{ fontSize: "0.8em", textAlign: "center" }}>{data.winDetail}</div>}
                </div>}
        </SimpleBar>

        <div style={{ display: "flex" }}>
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
    </div >
}