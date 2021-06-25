import { useGame } from "../providers/ProvideGame"
import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/Badge'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { Scrollbars } from 'react-custom-scrollbars';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useLayoutEffect, useRef } from "react"

const unicode = { K: ['\u2654', '\u265A'], Q: ['\u2655', '\u265B'], R: ['\u2656', '\u265C'], B: ['\u2657', '\u265D'], N: ['\u2658', '\u265E'] }

export default function Moves() {

    const [game, board, , updateTurn] = useGame()
    const scbarsRef = useRef(null)
    useLayoutEffect(() => {
        if (scbarsRef.current) {
            const scrollHeight = scbarsRef.current.getScrollHeight() * ((board.turn / game.movs.length) - 0.1)
            scbarsRef.current.scrollTop(scrollHeight)
        }
    }, [game, board])

    if (!game || !board) {
        return <></>
    }
    const prev = () => {
        updateTurn(board.turn - 1)
    }

    const next = () => {
        updateTurn(board.turn + 1)
    }

    const beg = () => {
        updateTurn(0)
    }

    const end = () => {
        updateTurn(game.movs.length)
    }


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
                <td style={{ cursor: 'pointer', width: '40%' }} onClick={() => updateTurn(t)}>
                    {l}</td>}
            {board.turn === t &&
                <td style={{ width: '40%' }}>
                    <Badge variant="primary" style={{ margin: '0px', fontSize: '1rem', fontWeight: 'normal' }}>
                        {l}</Badge>
                </td>}
        </>
    }

    return <div className='m-3' style={{ height: '30vh' }}>
        <Table striped size="sm" style={{ userSelect: 'none', margin: '0px' }}>
            <thead>
                <tr>
                    <th style={{ width: '20%' }}>#</th>
                    <th style={{ width: '40%' }}>
                        <div style={{ width: "25px", height: '25px', backgroundSize: '25px 25px', backgroundImage: `url('/assets/wp.svg')` }} />
                    </th>
                    <th style={{ width: '40%' }}>
                        <div style={{ width: "25px", height: '25px', backgroundSize: '25px 25px', backgroundImage: `url('/assets/bp.svg')` }} />
                    </th>
                </tr>
            </thead>
        </Table>
        <Scrollbars ref={scbarsRef} className='mb-2'>
            <Table striped size="sm" style={{ userSelect: 'none', margin: '0px' }}>
                <tbody>
                    {mat.map
                        ((r, i) => <tr key={i}>
                            <td style={{ width: '20%' }}>{i + 1}</td>
                            <MoveCell row={i} col={0} mov={r[0]} />
                            <MoveCell row={i} col={1} mov={r[1]} />
                        </tr>)
                    }
                </tbody>
            </Table>
        </Scrollbars>
        <ButtonGroup aria-label="Basic example">
            <Button disabled={board.turn === 0} style={{ float: 'left' }} onClick={beg}>
                <FaAngleDoubleLeft />
            </Button>
            <Button disabled={board.turn === 0} style={{ float: 'left' }} onClick={prev} >
                <FaAngleLeft />
            </Button>
            <Button disabled={board.turn === game.movs.length} style={{ float: 'left' }} onClick={next} >
                <FaAngleRight />
            </Button>
            <Button disabled={board.turn === game.movs.length} style={{ float: 'left' }} onClick={end} >
                <FaAngleDoubleRight />
            </Button>
        </ButtonGroup>
    </div>
}