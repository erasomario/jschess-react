import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FaMedal, FaPlus } from 'react-icons/fa';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { findGameById, setOpponentNotification } from '../../clients/game-client';
import { findGamesByStatus } from '../../clients/user-client';
import { useAuth } from '../../providers/ProvideAuth';
import { useGame } from '../../providers/ProvideGame';
import { getAsGameList } from './GamesListLogic';
import "./PlayerGamesList.css";

const Loading = ({ style }) => {
    return <div style={style}>Cargando</div>
}

const NoData = ({ type, style }) => {
    return <div style={{ ...style, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1em" }}>
        <b>{type === "open" ? "No tiene partidas en curso" : "Aun no tiene partidas finalizadas"}</b>
        <div>Puede iniciar un juego contra amigos o contra el computador en la opción <FaPlus /> del inicio.</div>
        <div style={{ height: "5em" }}></div>
    </div>
}

const Pawn = ({ color }) => {
    return <div className="pawn" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/${color}p.svg')` }} />
}

const GameItem = React.forwardRef((props, ref) => {

    const { game: g, onSelect } = props

    return <ListGroup.Item
        ref={g.selected ? ref : null}
        active={g.selected}
        onClick={() => onSelect(g.id)}
        style={{ cursor: 'pointer', margin: "0", padding: "0.4em" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
                <div className="playerSubRow">
                    <Pawn color={'w'} />{g.whiteName}
                    {(g.whiteHighlight && !g.ended) && <div className="gameListDot" />}
                    {(g.whiteHighlight && g.ended) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
                <div className="playerSubRow">
                    <Pawn color={'b'} />{g.blackName}
                    {(g.blackHighlight && !g.ended) && <div className="gameListDot" />}
                    {(g.blackHighlight && g.ended) && <FaMedal style={{ marginLeft: "0.5em" }} />}
                </div>
            </div>
            {g.isNew && <div className="gameListNew">Nueva</div>}
            {g.ended &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
                    {g.draw && <div>Empate</div>}
                    {new Date(g.createdAt).toLocaleDateString("es-CO")}
                </div>
            }
        </div>
    </ListGroup.Item>
})

export default function PlayerGamesList({ show, onHide = a => a }) {
    const ref = useRef()
    const { user } = useAuth()
    const { game, updateGame } = useGame()
    const [error, setError] = useState(null)
    const [openGames, setOpenGames] = useState(null)
    const [closedGames, setClosedGames] = useState(null)
    const [loading, setLoading] = useState(true)

    const scroll = useCallback(() => { ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" }) }, [])

    useEffect(() => {
        if (show) {
            findGamesByStatus(user.id, user.api_key, "open")
                .then(l => getAsGameList(l, game, user))
                .then(setOpenGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .catch(e => setError(e.message))
                .finally(scroll)

            findGamesByStatus(user.id, user.api_key, "closed")
                .then(l => getAsGameList(l, game, user))
                .then(setClosedGames)
                .then(() => setError())
                .then(() => setLoading(false))
                .catch(e => setError(e.message))
                .finally(scroll)
        }
    }, [show, game, user, scroll])

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
                                    ref={ref} />)}
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
                                    ref={ref} />)}
                            </ListGroup>
                        </SimpleBar>
                    }
                </Tab>
            </Tabs>
            {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}