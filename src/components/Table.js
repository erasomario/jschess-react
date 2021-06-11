import { useCallback, useEffect, useState } from "react"
import { useAuth } from "../providers/ProvideAuth"
import { Board } from './Board'

export function Table({ game }) {
    const [user] = useAuth()
    const reversed = game ? user.id !== game.whitePlayerId : false;

    if (!game) {
        return <></>
    }

    return <>
        <div>{!reversed ? game.blackPlayerName : game.whitePlayerName}</div>
        <Board reversed={reversed} game={game} turn={game.turn}></Board>
        <div>{!reversed ? game.whitePlayerName : game.blackPlayerName}</div>
    </>
}