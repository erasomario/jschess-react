import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { Board } from './Board'
import { Captured } from './Captured'

export function Table() {
    const [user] = useAuth()
    const [game, board, , setTurn] = useGame()
    const reversed = game ? user.id !== game.whitePlayerId : false;
    if (!game || !board) {
        return <></>
    }

    const prev = () => {
        setTurn(board.turn - 1)
    }

    const next = () => {
        setTurn(board.turn + 1)
    }

    const beg = () => {
        setTurn(0)
    }

    const end = () => {
        setTurn(game.turn)
    }

    return <>
        <Captured position='top' game={game} board={board} user={user} reversed={reversed} />
        <Board reversed={reversed} turn={game.turn}></Board>
        <Captured position='bottom' game={game} board={board} user={user} reversed={reversed} />

        <div>
            <button disabled={board.turn === 0} style={{ float: 'left' }} onClick={beg}>Beg</button>
            <button disabled={board.turn === 0} style={{ float: 'left' }} onClick={prev}>Prev</button>
            <div style={{ float: 'left' }}>{board.turn}</div>
            <button disabled={board.turn === game.turn} style={{ float: 'left' }} onClick={next}>Next</button>
            <button disabled={board.turn === game.turn} style={{ float: 'left' }} onClick={end}>End</button>
        </div>
    </>
}