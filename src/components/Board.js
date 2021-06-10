import { useEffect, useState } from "react"

export function Board({ game }) {

    const [curGame, setGame] = useState(null)

    useEffect(() => { setGame(game); console.log(game); }, [game])



    return <h1>{curGame && curGame.whiteId.username}</h1>
}