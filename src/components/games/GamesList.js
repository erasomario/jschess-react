import { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAuth } from '../../providers/ProvideAuth'
import Modal from 'react-bootstrap/Modal'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { findGamesByStatus } from '../../controllers/user-client';
import { useGame } from '../../providers/ProvideGame';
import { findGameById } from '../../controllers/game-client';

export default function GamesList({ style, show, onHide = a => a, onSelect = (a) => a }) {

    const { game, board, updateGame, updateTurn } = useGame()
    const [error, setError] = useState()
    const [games, setGames] = useState()
    const { user } = useAuth()

    useEffect(() => {
        if (show) {
            findGamesByStatus(user.id, user.api_key, "open")
                .then(setGames)
                .catch(e => setError(e.message))
        }
    }, [show, setGames, setError, user])

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
                        //(g.whiteId === user.id && g.turn % 2 === 0)
                        <ListGroup.Item
                            className='m-0 p-2'
                            key={g.id}
                            active={game?.id === g.id}
                            onClick={() => select(g.id)}
                            style={{ cursor: 'pointer' }}>
                            <div style={{ fontWeight: 'bold' }}>{g.whiteId === user.id ? g.whiteName : g.blackName}</div>
                            <p className='m-0 p-0'>{g.turn % 2 === 0 ? `Turno de ${g.whiteName}` : `Turno de ${g.blackName}`}</p>
                        </ListGroup.Item>)}
                </ListGroup>
            </SimpleBar>
        </Modal.Body>
    </Modal>
}