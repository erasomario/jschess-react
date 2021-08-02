import React, { useContext, createContext, useState, useCallback, useEffect } from "react"
import { getBoard } from '../utils/Chess'
import { useAuth } from "./ProvideAuth";
import { findGameById } from "../clients/game-client"

const gameContext = createContext();

export function ProvideGame({ children }) {
    const { user, remember } = useAuth()
    const [game, setGame] = useState(null)
    
    const updateGame = useCallback(g => {
        setGame({ ...g, board: getBoard(g.movs, g.movs.length) })
    }, [])

    const updateTurn = useCallback(t => {
        setGame(g => { return { ...g, board: getBoard(g.movs, t) } })
    }, [])

    useEffect(() => {
        const gId = (remember ? window.localStorage : window.sessionStorage).getItem('gameId')
        if (gId && user) {
            findGameById(gId, user.api_key).then(updateGame).catch(e => e)
        } else {
            setGame(null)
        }
    }, [user, remember, updateGame])

    useEffect(() => {
        if (game?.id) {
            if (remember) {
                window.localStorage.setItem('gameId', game.id)
            } else {
                window.sessionStorage.setItem('gameId', game.id)
            }
        }
    }, [game?.id, game?.whiteId, game?.blackId, user, remember])
    const val = { game, updateGame, updateTurn }
    return (
        <gameContext.Provider value={val}>
            {children}
        </gameContext.Provider>
    )
}

export function useGame() {
    return useContext(gameContext);
}