import Table from 'react-bootstrap/Table'
import { useGame } from "../providers/ProvideGame"

export default function Moves() {
    const [game, board, , updateTurn] = useGame()
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
        updateTurn(game.turn)
    }


    const mat = []
    for (let i = 0; i < Math.ceil(game.movs.length / 2); i++) {
        mat.push([game.movs[i * 2], (i * 2) + 1 < game.movs.length ? game.movs[(i * 2) + 1] : null])
    }

    return <>
        <Table style={{ userSelect: 'none' }}>
            <tbody>
                {mat.map
                    ((r, i) => <tr key={i}>
                        <td>{i + 1}</td>
                        <td style={{ cursor: 'pointer', fontWeight: board.turn === (i * 2) + 1 ? 'bold' : 'normal' }} onClick={() => updateTurn((i * 2) + 1)}>{r[0].label}</td>
                        <td style={{ cursor: 'pointer', fontWeight: board.turn === (i * 2) + 2 ? 'bold' : 'normal' }} onClick={() => updateTurn((i * 2) + 2)}>{r[1] && r[1].label}</td>
                    </tr>)
                }
            </tbody>
        </Table>
        <div>
            <button disabled={board.turn === 0} style={{ float: 'left' }} onClick={beg}>Beg</button>
            <button disabled={board.turn === 0} style={{ float: 'left' }} onClick={prev}>Prev</button>
            <div style={{ float: 'left' }}>{board.turn}/{game.movs.length}</div>
            <button disabled={board.turn === game.movs.length} style={{ float: 'left' }} onClick={next}>Next</button>
            <button disabled={board.turn === game.movs.length} style={{ float: 'left' }} onClick={end}>End</button>
        </div>
    </>
}