import React, { useContext, createContext, useState, useCallback } from "react"
import { getBoard } from '../utils/Chess'

const gameContext = createContext();

export function ProvideGame({ children }) {
    const [game, setGame] = useState(null)
    const [board, setBoard] = useState(null)

    const updateGame = useCallback((g) => {
        setGame(g)
        if (g) {
            setBoard(getBoard(g.pieces, g.turn))
        } else {
            setBoard(null)
        }
    }, [])

    const val = [game, board, updateGame]
    return (
        <gameContext.Provider value={val}>
            {children}
        </gameContext.Provider>
    );
}

export function useGame() {
    return useContext(gameContext);
}

