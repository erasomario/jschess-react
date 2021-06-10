import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CreateGame from "./CreateGame";
import GamesList from "./GamesList";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../providers/ProvideAuth";
import { apiRequest } from "../utils/ApiClient";

export default function LeftTabs({ onGameSelected = (a) => a }) {

    const [openGamesList, setOpenGamesList] = useState([])
    const [selectedGame, setSelectedGame] = useState(null)
    const [user] = useAuth()

    const [key, setKey] = useState('open');

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


    return <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}>
        <Tab eventKey="new" title="Nueva Partida">
            <CreateGame onNewGame={gameCreated}></CreateGame>
        </Tab>
        <Tab eventKey="open" title="Partidas">
            <GamesList games={openGamesList} selected={selectedGame} onSelect={onGameSelected} ></GamesList>
        </Tab>
    </Tabs>
}