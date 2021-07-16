import React, { useContext, createContext, useState, useCallback, useEffect } from "react"
import { findUserById } from "../controllers/user-client";
import { getBoard } from '../utils/Chess'
import { useAuth } from "./ProvideAuth";
import { findGameById } from "../controllers/game-client"

const gameContext = createContext();

export function ProvideGame({ children }) {

    const { user, remember } = useAuth()
    const [game, setGame] = useState(null)
    const [board, setBoard] = useState(null)
    const [opponent, setOpponent] = useState(null)

    useEffect(() => {
        const gId = (remember ? window.localStorage : window.sessionStorage).getItem('gameId')
        if (gId && user) {
            findGameById(gId, user.api_key).then(setGame).catch(e => e)
        } else {
            setGame(null)
        }
    }, [user, remember])

    useEffect(() => {
        if (game) {
            if (remember) {
                window.localStorage.setItem('gameId', game.id)
            } else {
                window.sessionStorage.setItem('gameId', game.id)
            }
            setBoard(getBoard(game.movs, game.movs.length))
            findUserById(user.id === game.whiteId ? game.blackId : game.whiteId, user.api_key).then(setOpponent)
        } else {
            setBoard(null)
        }
    }, [game, user, remember])

    const updateGame = useCallback(async g => {
        setGame(g)
    }, [])

    const updateTurn = useCallback((t) => {
        setBoard(game ? getBoard(game.movs, t) : null)
    }, [game])

    const val = { game, board, opponent, updateGame, updateTurn }
    return (
        <gameContext.Provider value={val}>
            {children}
        </gameContext.Provider>
    );
}

export function useGame() {
    return useContext(gameContext);
}

