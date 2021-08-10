import React, { useCallback, useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaFlag, FaPlus, FaStarHalfAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Moves from '../components/moves/Moves';
import EditUserDialog from '../components/users/EditUserDialog';
import { getProfilePictureUrl } from '../clients/user-client';
import { useDimensions } from '../hooks/useDimensions';
import { useAuth } from '../providers/ProvideAuth';
import { useGame } from '../providers/ProvideGame';
import { useSocket } from '../providers/ProvideSocket';
import './blablabla.css';
import { Board } from './games/Board';
import CreateGameDialog from './games/CreateGameDialog';
import GameEndedDialog from './games/GameEndedDialog';
import { PlayerData } from './games/PlayerData';
import { getPlayersData } from './games/PlayerDataUtils';
import OpenGameButton from './games/OpenGameButton';
import { makeYesNoDialog, YesNoDialog } from './games/YesNoDialog';
import { acceptDraw, offerDraw, rejectDraw, surrender } from '../clients/game-client';
import OpenWatchGamesButton from './games/OpenWatchGamesButton';

const SurrenderButton = ({ onSurrender, game, user }) => {
    return <Button disabled={!(game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))} variant="primary" onClick={onSurrender}><FaFlag style={{ marginTop: -4 }} ></FaFlag></Button>
}

const OfferDrawButton = ({ onDrawOffer, game, user }) => {
    return <Button disabled={!(game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))} variant="primary" onClick={onDrawOffer}><FaStarHalfAlt style={{ marginTop: -4 }} ></FaStarHalfAlt></Button>
}

export default function HomePage() {
    const [yesNoData, setYesNoData] = useState()
    const { addSocketListener } = useSocket()
    const { width, height } = useDimensions()
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [showNewGameDialog, setShowNewGameDialog] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const [pictureUrl, setPictureUrl] = useState()
    const { user, signOut } = useAuth()
    const { game, updateGame } = useGame()
    const reversed = game ? user.id === game.blackId : false

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
            //I'm not watching this game right now 
            const myColor = ng.whiteId === user.id ? "w" : (ng.blackId === user.id ? "b" : null)
            if (myColor) {
                if (ng.result) {
                    //the game ended and I'm one of the players
                    toast(`El juego contra ${myColor === "w" ? ng.blackName : ng.whiteName} finalizó`)
                } else {
                    const turn = ng.movs.length % 2 === 0 ? "w" : "b"
                    if (turn === myColor) {
                        //if it's my turn to play it means my opponent made a move
                        toast(`${myColor === "w" ? ng.blackName : ng.whiteName} hizo un movimiento en otro juego`)
                    }
                }
            }
        }
    }, [updateGame, game?.id, user?.id]);

    /*  const invitedToGame = useCallback((ng, open) => {
          toast(`${ng.whiteId === user.id ? ng.blackName : ng.whiteName} le invita a un nuevo juego`)
          open && updateGame(ng)
      }, [updateGame, user?.id]);*/

    useEffect(() => {
        if (!user) {
            return
        }
        addSocketListener('gameChanged', data => {
            gameChanged(data)
        })
    }, [addSocketListener, gameChanged, user]);

    useEffect(() => {
        if (!user) {
            return
        }
        addSocketListener('drawOffered', gameId => {
            if (gameId === game?.id) {
                const opponentName = (user.id === game.whiteId ? game.whiteName : game.blackName)
                setYesNoData(makeYesNoDialog("Confirmación", `${opponentName} le ofrece un empate`, "Aceptar", "Rechazar", () => {
                    acceptDraw(user?.api_key, game?.id)
                        .catch(e => toast.error(e.message))
                }, () => {
                    rejectDraw(user?.api_key, game?.id)
                        .catch(e => toast.error(e.message))
                }))
            }
        })
    }, [addSocketListener, game?.id, game?.whiteId, game?.blackName, game?.whiteName, user]);

    useEffect(() => {
        if (!user) {
            return
        }
        addSocketListener('drawRejected', gameId => {
            if (gameId === game?.id) {
                const opponentName = (user.id === game.whiteId ? game.blackName : game.whiteName)
                toast.error(`${opponentName} rechazó su ofrecimiento de empate`)
            }
        })
    }, [addSocketListener, game?.id, game?.whiteId, game?.blackName, game?.whiteName, user]);

    /*useEffect(() => {
        if (!user) {
            return
        }
        addSocketListener('openNewGame', data => {
            invitedToGame(data, true)
        })
        addSocketListener('invitedToGame', data => {
            invitedToGame(data, false)
        })
    }, [addSocketListener, invitedToGame, user])*/

    const logout = (e) => {
        e.preventDefault()
        signOut(() => { })
    }

    if (!user) {
        return <></>
    }

    const onDrawOfferClicked = () => {
        setYesNoData(makeYesNoDialog("Confirmación", "¿Desea ofrecer un empate?", "Si", "No", () => {
            offerDraw(user?.api_key, game?.id)
                .then(() => {
                    if (game.whiteId === user.id ? game.blackId : game.whiteId) {
                        //if you offer draw to bot you'll get an inmediate answer, so this toast is not needed
                        toast.info(`Su ofrecimiento de empate se envió a ${game.whiteId !== user.id ? game.whiteName : game.blackName}`)
                    }
                })
                .catch(e => toast.error(e.message))
        }))
    }

    const onSurrender = () => {
        setYesNoData(makeYesNoDialog("Confirmación", "¿Realmente desea rendirse?", "Si", "No", () => {
            surrender(user?.api_key, game?.id)
                .catch(e => toast.error(e.message))
        }))
    }

    const [topData, bottomData] = getPlayersData(game, user, reversed)

    const orient = width / height > 1.6 ? "h" : "v"
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
        <YesNoDialog dialog={yesNoData} />
        <div className='' style={{
            background: 'linear-gradient(0deg, #eef2f3 0%, #CED6DC 100%)', padding: "1em"
        }}>
            <EditUserDialog show={showUserDialog} onHide={() => { setShowUserDialog(false) }}></EditUserDialog>
            <CreateGameDialog show={showNewGameDialog} onHide={() => { setShowNewGameDialog(false) }} onNewGame={updateGame}></CreateGameDialog>
            <GameEndedDialog show={showEndDialog} onHide={() => { setShowEndDialog(false) }} onNewGame={updateGame}></GameEndedDialog>

            <ToastContainer position="top-right" autoClose={5000}
                hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss pauseOnHover />
            {orient === "v" && <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <PlayerData mode='h' playerInfo={topData} />
                    <Board style={{ margin: "0.75em 0 0.75em 0" }} reversed={reversed} turn={game?.turn} size={size}></Board>
                    <PlayerData mode='h' playerInfo={bottomData} />
                </div>
                <div style={{ position: "absolute", display: "flex", flexDirection: "row", gap: "0.5em" }}>
                    <Button variant="primary" onClick={() => setShowNewGameDialog(true)}><FaPlus style={{ marginTop: -4 }} ></FaPlus></Button>
                    <OpenGameButton></OpenGameButton>
                </div>
            </>}

            {orient === "h" && <>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", gap: "0.5em" }}>
                    <Button variant="primary" onClick={() => setShowNewGameDialog(true)}><FaPlus style={{ marginTop: -4 }} ></FaPlus></Button>
                    <OpenGameButton></OpenGameButton>
                    <OfferDrawButton game={game} onDrawOffer={onDrawOfferClicked} user={user} />
                    <SurrenderButton game={game} onSurrender={onSurrender} user={user} />
                    <OpenWatchGamesButton></OpenWatchGamesButton>
                </div>
                <div style={{ userSelect: "none", display: "flex", justifyContent: "center" }}>
                    <div style={{ flexDirection: "column", flexBasis: "33%", paddingRight: "2em" }}>
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
                    <div style={{ backgroundColor: '', flexBasis: "40%", paddingLeft: "2em" }}>
                        {true && <DropdownButton as={ButtonGroup} title={user.username} variant="link">
                            <Dropdown.Item onClick={() => setShowUserDialog(true)}>Editar Perfil</Dropdown.Item>
                            <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
                        </DropdownButton>}
                        <img alt="" src={pictureUrl} style={{ borderRadius: '50%', width: "2em", height: "2em" }} />
                        <Moves onNewGame={updateGame} style={{ height: "28em" }}></Moves>
                    </div>
                </div>
            </>}
        </div>
    </>
}