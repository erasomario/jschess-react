import { useState, useEffect, useRef } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAuth } from '../../providers/ProvideAuth'
import Modal from 'react-bootstrap/Modal'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { findGamesByStatus } from '../../controllers/user-client';
import { useGame } from '../../providers/ProvideGame';
import { findGameById } from '../../controllers/game-client';
import { Alert } from 'react-bootstrap';

export default function GamesList({ style, show, onHide = a => a, onSelect = (a) => a }) {

    const selectedDOM = useRef()

    const { game, updateGame } = useGame()
    const [error, setError] = useState()
    const [games, setGames] = useState()
    const { user } = useAuth()

    useEffect(() => {
        if (show) {
            setError()
            findGamesByStatus(user.id, user.api_key, "open")
                .then(setGames)
                .then(selectedDOM.current?.scrollIntoView())
                .catch(e => setError(e.message))
        }
    }, [show, user])

    const select = async (gameId) => {
        try {
            const game = await findGameById(gameId, user.api_key)
            updateGame(game)
            onHide()
        } catch (e) {

        }
    }

    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <div style={{ overflow: 'hidden' }} >
                <h4 style={{ display: "inline" }} className='align-top'>Partidas</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            <SimpleBar style={{ ...style, height: "15rem" }}>
                <ListGroup>
                    {!games && <p>Cargando...</p>}
                    {!games?.length === 0 && <p>No hay partidas en curso...</p>}
                    {games && games.map(g =>
                        <ListGroup.Item
                            ref={game?.id === g.id ? selectedDOM : null}
                            className='m-0 p-2'
                            key={g.id}
                            active={game?.id === g.id}
                            onClick={() => select(g.id)}
                            style={{ cursor: 'pointer' }}>
                            <div style={{ fontWeight: 'bold' }}>{g.whiteId === user.id ? g.blackName : g.whiteName}</div>
                            <p className='m-0 p-0'>{g.turn % 2 === 0 ? `Turno de ${g.whiteName}` : `Turno de ${g.blackName}`}</p>
                        </ListGroup.Item>)}
                </ListGroup>
            </SimpleBar>
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}