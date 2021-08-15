import React, { useCallback, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FaBinoculars } from 'react-icons/fa'
import { createSubcriber, findCurrentGames } from '../../clients/game-client'
import { useAuth } from '../../providers/ProvideAuth'
import { useGame } from '../../providers/ProvideGame'
import { GamesList } from './GamesList'

export default function CurrentGamesList({ show, onHide = a => a }) {
    const { user } = useAuth()
    const { updateGame } = useGame()
    const [error, setError] = useState(null)

    const getCurrentGames = useCallback(() => findCurrentGames(user.api_key)
        , [user.api_key])

    const select = async gameId => {
        try {
            updateGame(await createSubcriber(user.api_key, gameId))
            onHide()
        } catch (e) {
            setError(e.message)
        }
    }

    const height = "20em"
    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FaBinoculars style={{ marginRight: "0.3em" }} />
                <div>Partidas en Vivo</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <GamesList onDataNeeded={getCurrentGames} height={height} onSelect={select}
                emptyMessage="No hay partidas para ver en este momento" />
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}