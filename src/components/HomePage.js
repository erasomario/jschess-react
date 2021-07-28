import React, { useCallback, useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaClipboardList, FaPlus } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moves from '../components/moves/Moves';
import EditUserDialog from '../components/users/EditUserDialog';
import { getProfilePictureUrl } from '../controllers/user-client';
import { useDimensions } from '../hooks/useDimensions';
import { useAuth } from '../providers/ProvideAuth';
import { useGame } from '../providers/ProvideGame';
import { useSocket } from '../providers/ProvideSocket';
import './blablabla.css';
import { Board } from './games/Board';
import CreateGameDialog from './games/CreateGameDialog';
import GameEndedDialog from './games/GameEndedDialog';
import GamesList from './games/GamesList';
import { PlayerData } from './games/PlayerData';
import { getPlayersData } from './games/PlayerDataUtils';

export default function HomePage() {

    const { addSocketListener, isSocketOpen } = useSocket()
    const { width, height } = useDimensions()
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [showNewGameDialog, setShowNewGameDialog] = useState(false)
    const [showGamesDialog, setShowGamesDialog] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const [pictureUrl, setPictureUrl] = useState()
    const { user, signOut } = useAuth()
    const { game, updateGame } = useGame()
    const reversed = game ? user.id === game.blackId : false;

    useEffect(() => {
        user && getProfilePictureUrl(user.id, user.hasPicture, user.api_key).then(setPictureUrl)
        document.body.style.backgroundColor = '#eef2f3'
    }, [user])

    const gameChanged = useCallback(ng => {
        if (game.id === ng.id) {
            //this is the game in watching right now, messages will be shown only when the game ends
            updateGame(ng)
            if (ng.result) {
                //show endgame message
                setShowEndDialog(true)
            }
        } else {
            const myColor = ng.whiteId === user.id ? "w" : "b"
            //I'm not watching this game right now 
            if (ng.result) {
                //the game ended
                toast(`El juego contra ${myColor === "w" ? ng.blackName : ng.whiteName} finalizó`)
            } else {
                const turn = ng.movs.length % 2 === 0 ? "w" : "b"
                if (turn === myColor) {
                    //if it's my turn to play it means my opponent made a move
                    toast(`${myColor === "w" ? ng.blackName : ng.whiteName} hizo un movimiento en otro juego`)
                }
            }
        }
    }, [updateGame, game?.id, user?.id]);

    const invitedToGame = useCallback((ng, open) => {
        toast(`${ng.whiteId === user.id ? ng.blackName : ng.whiteName} le invita a un nuevo juego`)
        open && updateGame(ng)
    }, [updateGame, user?.id]);

    useEffect(() => {
        if (!user || !isSocketOpen) {
            return
        }
        addSocketListener('gameChanged', data => {
            gameChanged(data)
        })
    }, [addSocketListener, gameChanged, user, isSocketOpen]);

    useEffect(() => {
        if (!user || !isSocketOpen) {
            return
        }
        addSocketListener('openNewGame', data => {
            invitedToGame(data, true)
        })
        addSocketListener('invitedToGame', data => {
            invitedToGame(data, false)
        })
    }, [addSocketListener, invitedToGame, user, isSocketOpen])

    const logout = (e) => {
        e.preventDefault()
        signOut(() => { })
    }

    if (!user) {
        return <></>
    }

    const [topData, bottomData] = getPlayersData(game, user, reversed)

    const orient = width > height ? "h" : "v"
    let size
    if (orient === "h") {
        let f;
        if (width >= 1200) {
            f = 0.8
        } else if (width >= 992) {
            f = 0.85
        } else {
            f = 0.95
        }
        size = (height * f) - 20
    } else {
        size = width - 30//30 is for 2em of padding, but it's wrong to asume it's 30
    }

    return <>
        <div className='' style={{
            background: 'linear-gradient(0deg, #eef2f3 0%, #CED6DC 100%)', padding: "1em"
        }}>
            <EditUserDialog show={showUserDialog} onHide={() => { setShowUserDialog(false) }}></EditUserDialog>
            <CreateGameDialog show={showNewGameDialog} onHide={() => { setShowNewGameDialog(false) }} onNewGame={updateGame}></CreateGameDialog>
            <GamesList show={showGamesDialog} onHide={() => { setShowGamesDialog(false) }}></GamesList>
            <GameEndedDialog show={showEndDialog} onHide={() => { setShowEndDialog(false) }} onNewGame={updateGame}></GameEndedDialog>

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

            {orient === "v" && <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}>
                    <PlayerData mode='h' playerInfo={topData} />
                    <Board reversed={reversed} turn={game?.turn} size={size}></Board>
                    <PlayerData mode='h' playerInfo={bottomData} />
                </div>
                <div style={{ position: "absolute", display: "flex", flexDirection: "row", gap: "0.5em" }}>
                    <Button variant="primary" onClick={() => setShowNewGameDialog(true)}><FaPlus style={{ marginTop: -4 }} ></FaPlus></Button>
                    <Button variant="primary" onClick={() => setShowGamesDialog(true)}><FaClipboardList style={{ marginTop: -4 }} ></FaClipboardList></Button>
                </div>
            </>}

            {orient === "h" && <>
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
                        <Moves onNewGame={updateGame} style={{ height: "22em" }}></Moves>
                    </div>
                </div>
            </>}
        </div>
    </>
}