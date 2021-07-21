import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import { useGame } from '../providers/ProvideGame'
import Moves from '../components/moves/Moves'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './blablabla.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import EditUserDialog from '../components/users/EditUserDialog'
import { getProfilePictureUrl } from '../controllers/user-client';
import CreateGame from './games/CreateGame';
import { Button } from "react-bootstrap";
import { FaPlus, FaClipboardList } from "react-icons/fa";
import GamesList from './games/GamesList';
import { Board } from './Board'
import { useDimensions } from '../hooks/useDimensions';
import { PlayerData } from './games/PlayerData';
import { getPlayersData } from './games/PlayerDataUtils';
import { useSocket } from '../providers/ProvideSocket';


export default function HomePage() {

    const { addSocketListener } = useSocket()
    const { width, height } = useDimensions()
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [showNewGameDialog, setShowNewGameDialog] = useState(false)
    const [showGamesDialog, setShowGamesDialog] = useState(false)
    const [pictureUrl, setPictureUrl] = useState()
    const { user, key, signOut } = useAuth()
    const { game, updateGame } = useGame()
    const reversed = game ? user.id === game.blackId : false;

    const gameSelected = useCallback(data => {
        if (game.id === data.game.id) {
            updateGame(data.game)
        } else {
            toast(data.msg)
        }
    }, [updateGame, game?.id]);

    useEffect(() => {
        user && getProfilePictureUrl(user.id, user.hasPicture, user.api_key).then(setPictureUrl)
        document.body.style.backgroundColor = '#eef2f3'
    }, [user])

    useEffect(() => {
        if (!user) {
            return
        }
        addSocketListener('gameTurnChanged', data => {
            console.log('gameTurnChanged', Date.now())
            gameSelected(data)
        })
    }, [addSocketListener, gameSelected, user]);

    const logout = (e) => {
        e.preventDefault()
        signOut(() => { })
    }

    const onNewGame = (game) => {
        setShowNewGameDialog(false)
        updateGame(game)
    }

    if (!user) {
        return <></>
    }

    const [topData, bottomData] = getPlayersData(game, user, reversed)
    const size = (height * 0.8) - 20

    return <>
        <div className='' style={{
            background: 'linear-gradient(0deg, #eef2f3 0%, #CED6DC 100%)', padding: "1em"
        }}>
            <EditUserDialog show={showUserDialog} onHide={() => { setShowUserDialog(false) }}></EditUserDialog>
            <CreateGame show={showNewGameDialog} onHide={() => { setShowNewGameDialog(false) }} onNewGame={onNewGame}></CreateGame>
            <GamesList show={showGamesDialog} onHide={() => { setShowGamesDialog(false) }}></GamesList>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: "0.5em" }}>
                <Button variant="primary" onClick={() => setShowNewGameDialog(true)}><FaPlus style={{ marginTop: -4 }} ></FaPlus></Button>
                <Button variant="primary" onClick={() => setShowGamesDialog(true)}><FaClipboardList style={{ marginTop: -4 }} ></FaClipboardList></Button>
            </div>
            <div style={{ userSelect: "none", display: "flex", justifyContent: "center", backgroundColor: "" }}>
                <div style={{ flexDirection: "column", flexBasis: "33%", paddingRight: "1.5em", backgroundColor: "" }}>
                    <div style={{
                        display: "flex", height: '50%', flexDirection: "column",
                        justifyContent: "flex-end", alignItems: 'flex-end'
                    }}>
                        <PlayerData mode='vt' playerInfo={topData} />
                    </div>
                    <div style={{
                        display: "flex", height: '50%', flexDirection: "column",
                        justifyContent: "flex-start", alignItems: 'flex-end'
                    }}>
                        <PlayerData mode='vb' playerInfo={bottomData} />
                    </div>
                </div>
                <Board reversed={reversed} turn={game?.turn} size={size}></Board>
                <div style={{ backgroundColor: '', flexBasis: "40%", paddingLeft: "1.5em" }}>
                    {true && <DropdownButton as={ButtonGroup} title={user.username} variant="link">
                        <Dropdown.Item onClick={() => setShowUserDialog(true)}>Editar Perfil</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
                    </DropdownButton>}
                    <img alt="" src={pictureUrl} style={{ borderRadius: '50%', width: "2em", height: "2em" }} />
                    <Moves></Moves>
                </div>
            </div>
        </div>
    </>
}