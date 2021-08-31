import React, { useCallback, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'
import { FaBinoculars } from 'react-icons/fa'
import { createSubcriber, findCurrentGames } from '../../clients/game-client'
import { useAuth } from '../../providers/ProvideAuth'
import { useGame } from '../../providers/ProvideGame'
import { GamesList } from './GamesList'

export default function CurrentGamesList({ show, onHide = a => a }) {
    const { t } = useTranslation()
    const { apiKey } = useAuth()
    const { updateGame } = useGame()
    const [error, setError] = useState(null)

    const getCurrentGames = useCallback(() => findCurrentGames(apiKey)
        , [apiKey])

    const select = async gameId => {
        try {
            updateGame(await createSubcriber(apiKey, gameId))
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
                <div>{t("watch live games")}</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <GamesList onDataNeeded={getCurrentGames} height={height} onSelect={select}
                emptyMessage={t("there are no live games to watch at this time")} />
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}