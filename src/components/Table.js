import { useAuth } from "../providers/ProvideAuth"
import { useGame } from "../providers/ProvideGame"
import { Board } from './Board'
import { Captured } from './Captured'

export function Table() {
    const {user} = useAuth()
    const [game, board] = useGame()
    const reversed = game ? user.id !== game.whitePlayerId : false;
    if (!game || !board) {
        return <></>
    }
   
    return <>
        <Captured position='top' game={game} board={board} user={user} reversed={reversed} />
        <Board reversed={reversed} turn={game.turn}></Board>
        <Captured position='bottom' game={game} board={board} user={user} reversed={reversed} />        
    </>
}