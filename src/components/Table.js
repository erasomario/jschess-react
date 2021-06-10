import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { Board } from './Board'

export function Table({ game }) {
    const [user] = useAuth()
    const reverse = game ? user.id !== game.whitePlayerId : false;

    if (!game) {
        return <></>
    }

    return <>
        <div>{!reverse ? game.blackPlayerName : game.whitePlayerName}</div>
        <Board reverse={reverse} game={game} turn={game.turn}></Board>
        <div>{!reverse ? game.whitePlayerName : game.blackPlayerName}</div>
    </>
}