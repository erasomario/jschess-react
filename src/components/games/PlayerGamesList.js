import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import { findGameById, setOpponentNotification } from '../../clients/game-client'
import { findGamesByStatus } from '../../clients/user-client'
import { useAuth } from '../../providers/ProvideAuth'
import { useGame } from '../../providers/ProvideGame'
import { GamesList } from './GamesList'
import { getAsGameList } from './GamesListLogic'
import "./PlayerGamesList.css"

export default function PlayerGamesList({ show, onHide = a => a }) {
    const { user } = useAuth()
    const { game, updateGame } = useGame()
    const [error, setError] = useState(null)
    const [openGames, setOpenGames] = useState(null)
    const [closedGames, setClosedGames] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState()

    useEffect(() => {
        if (show) {
            findGamesByStatus(user.id, user.api_key, "open")
                .then(l => getAsGameList(l, game, user))
                .then(setOpenGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .catch(e => setError(e.message))

            findGamesByStatus(user.id, user.api_key, "closed")
                .then(l => getAsGameList(l, game, user))
                .then(setClosedGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .catch(e => setError(e.message))

        }
    }, [show, game, user])

    useEffect(() => {
        if (openGames && (openGames.filter(e => e.id === game.id).length > 0)) {
            setTab("open")
        } else if (closedGames && (closedGames.filter(e => e.id === game.id).length > 0)) {
            setTab("closed")
        }
    }, [game?.id, openGames, closedGames])

    const select = async gameId => {
        try {
            const game = await findGameById(gameId, user.api_key)
            if (!game.opponentNotified) {
                setOpponentNotification(user.api_key, gameId)
            }
            updateGame(game)
            onHide()
        } catch (e) {
            setError(e.message)
        }
    }

    const height = "20em"

    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <div style={{ overflow: 'hidden' }} >
                <h4 style={{ display: "inline" }} className='align-top'>Partidas</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            <Tabs activeKey={tab} onSelect={t => { setTab(t); setError() }} className="mb-3">
                <Tab eventKey="open" title="En curso" >
                    <GamesList data={openGames} loading={loading} height={height} onSelect={select} />
                </Tab>
                <Tab eventKey="closed" title="Finalizadas">
                    <GamesList data={closedGames} loading={loading} height={height} onSelect={select} />
                </Tab>
            </Tabs>
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}