import React, { useCallback, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { FaFolder, FaFolderOpen } from 'react-icons/fa'

import { findGameById, setOpponentNotification } from '../../clients/game-client'
import { findGamesByStatus } from '../../clients/user-client'
import { useAuth } from '../../providers/ProvideAuth'
import { useGame } from '../../providers/ProvideGame'
import { GamesList } from './GamesList'
import "./PlayerGamesList.css"

export default function OpenGamesDialog({ show, onHide = a => a }) {
    const { user } = useAuth()
    const { updateGame } = useGame()
    const [error, setError] = useState(null)
    const [tab, setTab] = useState()

    const getOpen = useCallback(() =>
        findGamesByStatus(user.id, user.api_key, "open"),
        [user.api_key, user.id]
    )

    const getClosed = useCallback(() =>
        findGamesByStatus(user.id, user.api_key, "closed"),
        [user.api_key, user.id]
    )

    const setOpenTab = useCallback(() => { setTab("open") }, [])
    const setCloseTab = useCallback(() => { setTab("closed") }, [])

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
            <Modal.Title style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FaFolderOpen style={{ marginRight: "0.3em" }} />
                <div>Abrir Partida</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Tabs activeKey={tab} onSelect={t => { setTab(t); setError() }} className="mb-3">
                <Tab eventKey="open" title="En curso" >
                    <GamesList onDataNeeded={getOpen} height={height} onSelect={select}
                        emptyMessage="No tiene partidas en Curso"
                        onItemHighlighted={setOpenTab} />
                </Tab>
                <Tab eventKey="closed" title="Finalizadas">
                    <GamesList onDataNeeded={getClosed} height={height} onSelect={select}
                        emptyMessage="Aún no tiene partidas en Finalizadas"
                        onItemHighlighted={setCloseTab} />
                </Tab>
            </Tabs>
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}