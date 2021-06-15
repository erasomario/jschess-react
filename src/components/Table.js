import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { Board } from './Board'
import { Captured } from './Captured'

export function Table() {
    const [user] = useAuth()
    const [game, board] = useGame()
    const reversed = game ? user.id !== game.whitePlayerId : false;
    if (!game || !board) {
        return <></>
    }

    return <>
        <div>{!reversed ? game.blackPlayerName : game.whitePlayerName}</div>
        <Captured captured={reversed ? board.blackCaptured : board.whiteCaptured} />
        <Board reversed={reversed} turn={game.turn}></Board>
        <div>{!reversed ? game.whitePlayerName : game.blackPlayerName}</div>
        <Captured captured={reversed ? board.whiteCaptured : board.blackCaptured} />
    </>
}