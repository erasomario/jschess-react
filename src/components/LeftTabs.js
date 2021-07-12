import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateGame from "./games/CreateGame";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../providers/ProvideAuth";
import { apiRequest } from "../utils/ApiClient";
import { useGame } from "../providers/ProvideGame";

export default function LeftTabs({ onGameSelected = (a) => a }) {

    const {game} = useGame()
    const [openGamesList, setOpenGamesList] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)
    const { user } = useAuth()

    const [key, setKey] = useState('open')

    useEffect(() => {
        setOpenGamesList((o) => o.map(g => (
            (game && (game.id === g.id)) ? { ...g, turn: game.turn } : g)
        ))
    }, [game])

    const gameCreated = () => {
        getOpenGames()
        setKey("open")
    }

    const getOpenGames = useCallback(() => {
        console.log('reloading open game list');
        apiRequest(`/v1/users/${user.id}/games/open`, 'GET', user.api_key, null, (error, data) => {
            if (!error) {
                if (data && data.length > 0) {
                    setSelectedGame(data[0].id)
                    onGameSelected(data[0].id)
                }
                setOpenGamesList(data)
            } else {
                console.log(error)
            }
        })
    }, [user.id, user.api_key, onGameSelected]);

    useEffect(() => {
        getOpenGames();
    }, [getOpenGames]);


    return <>
        

        
    </>
}