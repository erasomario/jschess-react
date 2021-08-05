import React, { useState } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import Modal from 'react-bootstrap/Modal'
import { useGame } from '../../providers/ProvideGame';
import "./GameEndedDialog.css"
import { FaRedo, FaTimes } from 'react-icons/fa';
import { Alert, Button } from 'react-bootstrap';
import { rematch } from '../../clients/game-client';

const King = ({ style, result }) => {
    const piece = (result === "d" ? "rand" : result + "k")
    return <div className="EndedKing" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/${piece}.svg')`, ...style }} />
}

const capital = str => str.slice(0, 1).toUpperCase() + str.slice(1)

export default function GameEndedDialog({ show, onHide = a => a, onNewGame = a => a }) {
    const { user } = useAuth()
    const { game } = useGame()
    const [error, setError] = useState(null)

    const create = (e) => {
        e.preventDefault()
        rematch(user, game)
            .then(onNewGame)
            .then(onHide)
            .catch(e => setError(e.message))
    }

    if (!game) {
        return <></>
    }

    let detail, msg

    if (game.result === "d") {
        msg = "Empate"
    } else {
        msg = `¡Ganó ${game.result === "w" ? game.whiteName : game.blackName}!`
    }

    if (game.endType === "time") {
        detail = `${capital(game.result === "w" ? game.blackName : game.whiteName)} se quedó sin tiempo`
    } else if (game.endType === "check") {
        detail = `${capital(game.result === "w" ? game.whiteName : game.blackName)} dió jaque mate`
    } else if (game.endType === "stale") {
        detail = `${capital(game.movs.length % 2 === 0 ? game.whiteName : game.blackName)} se quedó sin opciones`
    } else if (game.endType === "material") {
        detail = "No hay piezas sufientes para llegar a un jaque mate"
    } else if (game.endType === "agreed") {
        detail = "Los jugadores acordaron a un acuerdo"
    } else if (game.endType === "surrender") {
        detail = `${capital(game.result === "b" ? game.whiteName : game.blackName)} se rindió`
    }


    return <Modal show={show} onHide={onHide}>
        <Modal.Body>
            <div style={{ position: "absolute", right: "1em", width: "1.5em", height: "1.5em" }}
                onClick={onHide}>
                <FaTimes style={{ width: "1.5em", height: "1.5em", color: "#90A4AE", cursor: "pointer" }}></FaTimes>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
                <King style={{ marginRight: "0.5em" }} result={game.result}></King>
                <div>
                    <div style={{ fontSize: "1.3em", fontWeight: "bold" }}>
                        {msg}
                    </div>
                    <div style={{ fontSize: "0.9em" }}>
                        {detail}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                <Button onClick={create}>
                    <span>Revancha</span><FaRedo className='ml-2' />
                </Button>
            </div>
            {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}