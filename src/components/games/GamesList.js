import React, { useState, useEffect, useRef } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { useAuth } from '../../providers/ProvideAuth'
import Modal from 'react-bootstrap/Modal'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { findGamesByStatus } from '../../controllers/user-client';
import { useGame } from '../../providers/ProvideGame';
import { findGameById } from '../../controllers/game-client';
import { Alert } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import "./GamesList.css"
import { FaMedal, FaPlus } from 'react-icons/fa';

const Loading = ({ style }) => {
    return <div style={style}>Cargando</div>
}

const NoData = ({ type, style }) => {
    return <div style={{ ...style, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1em" }}>
        <b>{type === "open" ? "No tiene partidas en curso" : "Aun no tiene partidas finalizadas"}</b>
        <div>Puede iniciar un juego contra amigos o contra el computador en <FaPlus /> del menú.</div>
        <div style={{ height: "5em" }}></div>
    </div>
}

const Pawn = ({ color }) => {
    return <div className="pawn" style={{ backgroundImage: `url('/assets/${color}p.svg')` }} />
}

const GameItem = React.forwardRef((props, ref) => {

    const { game: g, onSelect, selectedGame } = props

    let whiteDot, blackDot, draw
    if (g.result) {
        if (g.result === "w") {
            whiteDot = true
        } else if (g.result === "b") {
            blackDot = true
        } else if (g.result === "d") {
            draw = true;
        }
    } else {
        if (g.turn % 2 === 0) {
            whiteDot = true
        } else {
            blackDot = true
        }
    }

    return <ListGroup.Item
        ref={selectedGame?.id === g.id ? ref : null}
        className='m-0 p-2'
        active={selectedGame?.id === g.id}
        onClick={() => onSelect(g.id)}
        style={{ cursor: 'pointer' }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
                <div className="playerSubRow">
                    <Pawn color={'w'} />{g.whiteName}
                    {(whiteDot && !g.result) && <div className="gameListDot" />}
                    {(whiteDot && g.result) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
                <div className="playerSubRow">
                    <Pawn color={'b'} />{g.blackName}
                    {(blackDot && !g.result) && <div className="gameListDot" />}
                    {(blackDot && g.result) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
            </div>
            {g.result &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    {draw && <div>Empate</div>}
                    {new Date(g.createdAt).toLocaleDateString("es-CO")}
                </div>
            }
        </div>
    </ListGroup.Item>
})

export default function GamesList({ show, onHide = a => a }) {
    const ref = useRef()
    const { user } = useAuth()
    const { game, updateGame } = useGame()
    const [error, setError] = useState(null)
    const [openGames, setOpenGames] = useState(null)
    const [closedGames, setClosedGames] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (show) {
            findGamesByStatus(user.id, user.api_key, "open")
                .then(setOpenGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .then(() => { ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" }) })
                .catch(e => setError(e.message))

            findGamesByStatus(user.id, user.api_key, "closed")
                .then(setClosedGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .then(() => { ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" }) })
                .catch(e => setError(e.message))
        }
    }, [show, user])

    const select = async gameId => {
        try {
            const game = await findGameById(gameId, user.api_key)
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
            <Tabs defaultActiveKey="open" className="mb-3">
                <Tab eventKey="open" title="En curso">
                    {loading && <Loading style={{ height }} />}
                    {!loading && openGames?.length === 0 && <NoData style={{ height }} type="open" />}
                    {!loading && openGames?.length > 0 &&
                        <SimpleBar style={{ height }}>
                            <ListGroup>
                                {openGames.map(g => <GameItem
                                    key={g.id} game={g}
                                    onSelect={select}
                                    selectedGame={game} ref={ref} />)}
                            </ListGroup>
                        </SimpleBar>
                    }
                </Tab>
                <Tab eventKey="closed" title="Finalizadas">
                    {loading && <Loading style={{ height }} />}
                    {!loading && closedGames?.length === 0 && <NoData style={{ height }} type="closed" />}
                    {!loading && closedGames?.length > 0 &&
                        <SimpleBar style={{ height }}>
                            <ListGroup>
                                {closedGames.map(g => <GameItem
                                    key={g.id} game={g}
                                    onSelect={select}
                                    selectedGame={game} ref={ref} />)}
                            </ListGroup>
                        </SimpleBar>
                    }
                </Tab>
            </Tabs>
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}