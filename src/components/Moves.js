import { useGame } from "../providers/ProvideGame"
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useLayoutEffect, useRef } from "react"
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

const unicode = { K: ['\u2654', '\u265A'], Q: ['\u2655', '\u265B'], R: ['\u2656', '\u265C'], B: ['\u2657', '\u265D'], N: ['\u2658', '\u265E'] }

export default function Moves() {

    const { game, board, updateTurn } = useGame()
    const scbarsRef = useRef(null)
    useLayoutEffect(() => {
        if (scbarsRef.current) {
            scbarsRef.current.scrollIntoView(false)
        }
    }, [game, board])

    if (!game || !board) {
        return <></>
    }
    const prev = () => updateTurn(board.turn - 1)
    const next = () => updateTurn(board.turn + 1)
    const beg = () => updateTurn(0)
    const end = () => updateTurn(game.movs.length)

    const mat = []
    for (let i = 0; i < Math.ceil(game.movs.length / 2); i++) {
        mat.push([game.movs[i * 2], (i * 2) + 1 < game.movs.length ? game.movs[(i * 2) + 1] : null])
    }


    function MoveCell({ row, col, mov }) {
        const t = (row * 2) + 1 + col
        let l
        if (mov) {
            const firstL = mov.label.slice(0, 1)
            if (['K', 'Q', 'R', 'B', 'N'].includes(firstL)) {
                l = mov && unicode[firstL][col] + mov.label.slice(1)
            } else {
                l = mov.label
            }
        }
        return <>
            {board.turn !== t &&
                <span style={{ cursor: "pointer", fontSize: "1em", flexBasis: "40%", padding: "0.1em 0.3em 0.1em 0.3em" }} onClick={() => updateTurn(t)}>
                    {l}</span>}
            {board.turn === t &&
                <span ref={scbarsRef} style={{ flexBasis: "40%" }}>
                    <span style={{ backgroundColor: "#007bff", color: "#FFFFFF", borderRadius: "0.25em", padding: "0.1em 0.3em 0.1em 0.3em" }}>{l}</span>
                </span>}
        </>
    }

    return <div style={{ width: '17em', fontSize: '2.1vh' }}>


        <div style={{
            display: "flex",
            fontSize: "1em",
            height: "2.2em",
            alignItems: "center",
            backgroundColor: (1 % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : ""),
            borderRadius: "0.25em"
        }}>
            <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>#</div>
            <div style={{ flexBasis: "40%", width: "1.5em", height: '1.5em', backgroundSize: '1.5em 1.5em', backgroundRepeat: "no-repeat", backgroundImage: `url('/assets/wp.svg')` }} />
            <div style={{ flexBasis: "40%", width: "1.5em", height: '1.5em', backgroundSize: '1.5em 1.5em', backgroundRepeat: "no-repeat", backgroundImage: `url('/assets/bp.svg')` }} />
        </div>
        <SimpleBar style={{ height: "22em" }} className='mb-2'>
            <div style={{ userSelect: 'none', margin: '0px' }}>
                {mat.map
                    ((r, i) => {
                        return <div style={{
                            display: "flex",
                            fontSize: "1em",
                            height: "2.2em",
                            alignItems: "center",
                            backgroundColor: (i % 2 === 0 ? "rgba(255, 255, 255, 0.3)" : ""),
                            borderRadius: "0.25em"
                        }} key={i}>
                            <div style={{ flexBasis: "20%", marginLeft: "0.75em" }}>{i + 1}</div>
                            <MoveCell row={i} col={0} mov={r[0]} />
                            <MoveCell row={i} col={1} mov={r[1]} />
                        </div>
                    })
                }

            </div>
        </SimpleBar>
        {true &&
            <ButtonGroup>
                <Button disabled={board.turn === 0} onClick={beg}>
                    <FaAngleDoubleLeft style={{ height: '1em' }} />
                </Button>
                <Button disabled={board.turn === 0} onClick={prev} >
                    <FaAngleLeft style={{ height: '1em' }} />
                </Button>
                <Button disabled={board.turn === game.movs.length} onClick={next} >
                    <FaAngleRight style={{ height: '1em' }} />
                </Button>
                <Button disabled={board.turn === game.movs.length} onClick={end} >
                    <FaAngleDoubleRight style={{ height: '1em' }} />
                </Button>
            </ButtonGroup>}
    </div>
}