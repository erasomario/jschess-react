import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { createSubcriber, findCurrentGames, findGameById } from '../../clients/game-client'
import { useAuth } from '../../providers/ProvideAuth'
import { useGame } from '../../providers/ProvideGame'
import { GamesList } from './GamesList'
import { getAsGameList } from './GamesListLogic'

export default function CurrentGamesList({ show, onHide = a => a }) {
    const { user } = useAuth()
    const { game, updateGame } = useGame()
    const [error, setError] = useState(null)
    const [games, setGames] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (show) {
            findCurrentGames(user.api_key)
                .then(l => getAsGameList(l, game, user))
                .then(setGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .catch(e => setError(e.message))
        }
    }, [show, game, user])

    const select = async gameId => {
        try {
            const game = await createSubcriber(user.api_key, gameId)
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
                <h4 style={{ display: "inline" }} className='align-top'>Partidas en Curso</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            <GamesList data={games} loading={loading} height={height} onSelect={select} />
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}