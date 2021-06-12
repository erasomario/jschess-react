import React, { useContext, createContext, useState } from "react"
import { apiRequest } from '../utils/ApiClient'

const gameContext = createContext();

export function ProvideGame({ children }) {
    const [game, setGame] = useState(null)
    const val = [game, setGame]
    return (
        <gameContext.Provider value={val}>
            {children}
        </gameContext.Provider>
    );
}

export function useGame() {
    return useContext(gameContext);
}

