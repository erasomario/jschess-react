import { useGame } from "../../providers/ProvideGame"
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { useCallback, useMemo } from "react"
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import './moves.css'

const unicode = { K: ['\u2654', '\u265A'], Q: ['\u2655', '\u265B'], R: ['\u2656', '\u265C'], B: ['\u2657', '\u265D'], N: ['\u2658', '\u265E'] }

const getMatElement = (movs, i) => {
    if (!movs[i]) {
        return null;
    }
    let lbl = movs[i].label;
    const firstL = lbl.slice(0, 1)
    if (['K', 'Q', 'R', 'B', 'N'].includes(firstL)) {
        lbl = unicode[firstL][i % 2 === 0 ? 0 : 1] + lbl.slice(1)
    }
    return { turn: i + 1, label: lbl }
}

const getMatrix = (movs) => {
    if (!movs) {
        return []
    }
    const mat = []
    for (let i = 0; i < Math.ceil(movs.length / 2); i++) {
        mat.push([getMatElement(movs, i * 2), getMatElement(movs, (i * 2) + 1)])
    }
    return mat
}

export default function Moves() {
    const { game, updateTurn } = useGame()
    const mat = useMemo(() => getMatrix(game?.movs), [game?.movs])
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
            {mat.map((r, i) => {
                return <div
                    ref={(r[0].turn === game.board.turn || r[1]?.turn === game.board.turn) ? sc : null}
                    className="movRow"
                    style={{
                        backgroundColor: (i % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : ""),
                    }} key={i}>
                    <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>{i + 1}</div>
                    <MoveCell mov={r[0]} />
                    <MoveCell mov={r[1]} />
                </div>
            })}
        </SimpleBar>

        <div style={{ display: "flex" }}>
            <button className="movBtn" onClick={beg} disabled={!board || board.turn === 1} >
                <FaAngleDoubleLeft className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={prev} disabled={!board || board.turn === 1}  >
                <FaAngleLeft className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={next} disabled={!board || board.turn === game.movs.length}  >
                <FaAngleRight className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={end} disabled={!board || board.turn === game.movs.length}  >
                <FaAngleDoubleRight className="movBtnIcon" />
            </button>
        </div>
    </div >
}