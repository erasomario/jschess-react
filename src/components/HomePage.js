import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { acceptDraw, offerDraw, rejectDraw, surrender } from '../clients/game-client'
import { findNotNotifiedGamesCount } from '../clients/user-client'
import WatchGamesList from "../components/menuButtons/WatchGamesList"
import Moves from '../components/moves/Moves'
import { useDimensions } from '../hooks/useDimensions'
import { getBrowserLang } from '../locales/LangSwitch'
import { useAuth } from '../providers/ProvideAuth'
import { useGame } from '../providers/ProvideGame'
import { useSocket } from '../providers/ProvideSocket'
import Drawer from '../utils/Drawer'
import { Board } from './games/Board'
import { BoardOptionsDialog } from './games/BoardOptionsDialog'
import GameEndedDialog from './games/GameEndedDialog'
import { PlayerData } from './games/PlayerData'
import { getPlayersData } from './games/PlayerDataUtils'
import { makeYesNoDialog, YesNoDialog } from './games/YesNoDialog'
import "./homePage.css"
import BecomeUserDialog from './menuButtons/BecomeUserDialog'
import "./menuButtons/drawerButtons.scss"
import EditUserButton from './menuButtons/EditUserButton'
import ExitButton from './menuButtons/ExitButton'
import MenuButton from './menuButtons/MenuButton'
import NewGameButton from './menuButtons/NewGameButton'
import NewGameDialog from './menuButtons/NewGameDialog'
import OfferDrawButton from './menuButtons/OfferDrawButton'
import OpenGameButton from './menuButtons/OpenGameButton'
import OpenGamesDialog from './menuButtons/OpenGamesDialog'
import SurrenderButton from './menuButtons/SurrenderButton'
import WatchGamesButton from './menuButtons/WatchGamesButton'
import EditUserDialog from "./users/EditUserDialog"

export default function HomePage() {
    const [t, i18n] = useTranslation()
    const [showNewGameDialog, setShowNewGameDialog] = useState(false)
    const [showGamesDialog, setShowGamesDialog] = useState(false)
    const [showWatchDialog, setShowWatchDialog] = useState(false)
    const [showSidePanel, setShowSidePanel] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [showBoardOpts, setshowBoardOpts] = useState(false)

    const [yesNoData, setYesNoData] = useState()
    const { addSocketListener } = useSocket()
    const { width, height } = useDimensions()
    const { user } = useAuth()
    const { game, updateGame } = useGame()
    const [notNotifiedCount, setNotNotifiedCount] = useState([])
    const reversed = game ? user.id === game.blackId : false

    const [options, setOptions] = useState()

    const onOptsChange = useCallback((opts) => { setOptions(opts); setshowBoardOpts(false) }, [])

    useEffect(() => {
        i18n.changeLanguage(user?.lang || getBrowserLang())
        setOptions(user?.boardOpts ? JSON.parse(user.boardOpts) : { coords: "in", colors: "light_blue", sounds: true })
    }, [i18n, user])

    useEffect(() => {
        addSocketListener("opponentNotificationUpdated", c => setNotNotifiedCount(c))
    }, [addSocketListener, user])

    useEffect(() => {
        if (user) {
            findNotNotifiedGamesCount(user.id, user.api_key)
                .then(c => setNotNotifiedCount(c.count))
                .catch(e => toast.error(e.message))
        }
    }, [user])

    useEffect(() => {
        if (user) {
            addSocketListener('drawOffered', gameId => {
                if (gameId === game?.id) {
                    const opponentName = (user.id === game.whiteId ? game.whiteName : game.blackName)
                    setYesNoData(makeYesNoDialog(t("confirm"), t("opponent offers you a draw", { opponent: opponentName }), t("accept"), t("reject"), () => {
                        acceptDraw(user?.api_key, game?.id)
                            .catch(e => toast.error(e.message))
                    }, () => {
                        rejectDraw(user?.api_key, game?.id)
                            .catch(e => toast.error(e.message))
                    }))
                }
            })
            addSocketListener('drawRejected', gameId => {
                if (gameId === game?.id) {
                    const opponentName = (user.id === game.whiteId ? game.blackName : game.whiteName)
                    toast.error(t("rejected your draw offer", { opponent: opponentName }))
                }
            })
        }
    }, [addSocketListener, game?.id, game?.whiteId, game?.blackName, game?.whiteName, user, t])

    const gameChanged = useCallback(ng => {
        if (game?.id === ng.id) {
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
                    toast(t("game against opponent ended", { opponent: myColor === "w" ? ng.blackName : ng.whiteName }))
                } else {
                    const turn = ng.movs.length % 2 === 0 ? "w" : "b"
                    if (turn === myColor) {
                        //if it's my turn to play it means my opponent made a move
                        toast(t("opponent made a move on another game", { opponent: myColor === "w" ? ng.blackName : ng.whiteName }))
                    }
                }
            }
        }
    }, [updateGame, game?.id, user?.id, t])

    useEffect(() => {
        if (user) {
            addSocketListener('gameChanged', data => {
                gameChanged(data)
            })
        }
    }, [addSocketListener, gameChanged, user])

    if (!user) {
        return <></>
    }

    const onDrawOfferClicked = () => {
        setYesNoData(makeYesNoDialog(t("confirm"), t("Do you wish to offer a draw?"), t("yes"), t("No"), () => {
            offerDraw(user?.api_key, game?.id)
                .then(() => {
                    if (game.whiteId === user.id ? game.blackId : game.whiteId) {
                        //if you offer draw to bot you'll get an inmediate answer, so this toast is not needed
                        toast.info(t("Your draw offering was sent to opponent", { opponent: game.whiteId !== user.id ? game.whiteName : game.blackName }))
                    }
                })
                .catch(e => toast.error(e.message))
        }))
    }

    const onSurrender = () => {
        setYesNoData(makeYesNoDialog(t("confirm"), t("do you really want to surrender?"), t("yes"), t("No"), () => {
            surrender(user?.api_key, game?.id)
                .catch(e => toast.error(e.message))
        }))
    }

    const onEndInfo = () => {
        setShowEndDialog(true)
    }

    const [topData, bottomData] = getPlayersData(game, user, reversed, t)
    const ratio = width / height
    const layout = ratio > 1.6 ? "h" : (ratio > 1.3 ? "hc" : "v")
    let boardSize
    if (layout === "h") {
        boardSize = (height - 50) * 0.9
    } else if (layout === "hc") {
        boardSize = height - 100
    } else if (layout === "v") {
        boardSize = width - 30//30 is for 2em of padding, but it's wrong to asume it's 30
    }

    let templateCols, templateRows
    if (layout === "h") {
        templateCols = `1fr ${boardSize}px 1.2fr`
        templateRows = `${boardSize / 2}px ${boardSize / 2}px`
    } else if (layout === "hc") {
        templateCols = `1fr ${boardSize}px 0.45fr`
        templateRows = `${boardSize / 2}px ${boardSize / 2}px`
    } else if (layout === "v") {
        templateCols = `1fr 1fr`
        templateRows = `0.25fr 0.125fr ${boardSize}px 0.125fr`
    }

    return <>
        <NewGameDialog show={showNewGameDialog} onHide={() => { setShowNewGameDialog(false) }} onNewGame={updateGame}></NewGameDialog>
        <OpenGamesDialog show={showGamesDialog} onHide={() => { setShowGamesDialog(false) }}></OpenGamesDialog>
        <WatchGamesList show={showWatchDialog} onHide={() => { setShowWatchDialog(false) }}></WatchGamesList>
        <EditUserDialog show={!user?.guest && showUserDialog} onHide={() => setShowUserDialog(false)}></EditUserDialog>
        <BecomeUserDialog guestId={user?.id} show={user?.guest && showUserDialog} onHide={() => setShowUserDialog(false)}></BecomeUserDialog>
        <YesNoDialog dialog={yesNoData} />
        <BoardOptionsDialog show={showBoardOpts} onHide={() => setshowBoardOpts(false)} options={options} onChange={onOptsChange}></BoardOptionsDialog>

        <GameEndedDialog show={showEndDialog} onHide={() => { setShowEndDialog(false) }} onNewGame={updateGame}></GameEndedDialog>

        <div style={{
            background: 'linear-gradient(180deg, #8e9eab -20%, #eef2f3 100%)',
            padding: "1em",
            display: "grid",
            gridTemplateColumns: templateCols,
            gridTemplateRows: templateRows,
            columnGap: "2.5em",
            position: "relative",
            userSelect: "none",
            minHeight: "100vh"
        }}>
            {layout === "v" &&
                <div style={{ gridColumn: "2/3", gridRow: "1/2", justifySelf: "end", alignSelf: "start" }}>
                    <MenuButton showCfgBtn={true}
                        onMenuClick={() => setShowSidePanel(true)}
                        onCfgClick={() => setshowBoardOpts(true)}
                        onEndInfoClick={[game?.whiteId, game?.blackId].includes(user?.id) && game?.result ? onEndInfo : null}
                    />
                </div>
            }
            <div className="mainButtons" style={{}}>
                {layout === "hc" &&
                    <MenuButton showCfgBtn={false} onMenuClick={() => setShowSidePanel(true)} />
                }
                {layout === "h" && <>
                    <NewGameButton compact={true} onClick={() => setShowNewGameDialog(true)} />
                    <OpenGameButton compact={true} onClick={() => { setShowGamesDialog(true) }} notNotifiedCount={notNotifiedCount} />
                    <WatchGamesButton compact={true} onClick={() => setShowWatchDialog(true)} />
                    <OfferDrawButton compact={true} onClick={onDrawOfferClicked} />
                    <SurrenderButton compact={true} onClick={onSurrender} />
                </>}
            </div>

            <div style={(layout !== "v" ? { gridColumn: "2/3", gridRow: "1/3" } : { gridColumn: "1/3", gridRow: "3/4" })}>
                <Board reversed={reversed} turn={game?.turn} size={boardSize} showCfgButton={layout !== "v"}
                    options={options} onOptionsClicked={() => setshowBoardOpts(true)} ></Board>
            </div>
            <div style={
                (layout === "h" ? { gridColumn: "3/4", gridRow: "1/3" } :
                    (layout === "v" ? { gridColumn: "1/2", gridRow: "1/2", justifySelf: "start", alignSelf: "start" } :
                        { position: "absolute", left: "1em", bottom: "1em" })
                )}>
                <Moves compact={layout !== "h"}
                    onNewGame={updateGame}
                    onEditClicked={() => setShowUserDialog(true)}
                    style={{ height: "28em" }} />
            </div>
            <div style={(layout === "v" ?
                { gridColumn: "1/3", gridRow: "2/3", padding: "0.5em 0 0.5em 0" } :
                { gridColumn: "1/2", gridRow: "1/2", alignSelf: "end" })}>
                <PlayerData
                    mode={layout[0] === "h" ? "vt" : "h"} playerInfo={topData} />
            </div>
            <div style={(layout === "v" ?
                { gridColumn: "1/3", gridRow: "4/5", padding: "0.5em 0 0em 0" } :
                { gridColumn: "1/2", gridRow: "2/3" })}>
                <PlayerData
                    mode={layout[0] === "h" ? "vb" : "h"} playerInfo={bottomData} />
            </div>
        </div>
        {layout !== "h" && <Drawer position={layout === "hc" ? "left" : "right"} width="15em" show={showSidePanel} onHide={() => setShowSidePanel(false)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "start", marginTop: "1em" }}>
                <NewGameButton compact={false}
                    onClick={() => {
                        setShowSidePanel(false)
                        setShowNewGameDialog(true)
                    }} />
                <OpenGameButton compact={false}
                    onClick={() => {
                        setShowSidePanel(false)
                        setShowGamesDialog(true)
                    }} notNotifiedCount={notNotifiedCount} />
                <WatchGamesButton compact={false}
                    onClick={() => {
                        setShowSidePanel(false)
                        setShowWatchDialog(true)
                    }} />
                <OfferDrawButton compact={false}
                    onClick={() => {
                        setShowSidePanel(false)
                        onDrawOfferClicked()
                    }} />
                <SurrenderButton compact={false}
                    onClick={() => {
                        setShowSidePanel(false)
                        onSurrender()
                    }} />

                <EditUserButton user={user} onEditClicked={() => {
                    setShowSidePanel(false)
                    setShowUserDialog(true)
                }} />
                <ExitButton />
            </div>
        </Drawer>}
    </>
}