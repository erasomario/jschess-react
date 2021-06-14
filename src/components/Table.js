import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { Board } from './Board'

export function Table() {
    const [user] = useAuth()
    const [game] = useGame()
    const reversed = game ? user.id !== game.whitePlayerId : false;
    if (!game) {
        return <></>
    }

    return <>
        <div>{!reversed ? game.blackPlayerName : game.whitePlayerName}</div>
        <Board reversed={reversed} turn={game.turn}></Board>
        <div>{!reversed ? game.whitePlayerName : game.blackPlayerName}</div>
    </>
}