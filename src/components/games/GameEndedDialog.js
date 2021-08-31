import React, { useState } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import Modal from 'react-bootstrap/Modal'
import { useGame } from '../../providers/ProvideGame'
import "./GameEndedDialog.css"
import { FaRedo, FaTimes } from 'react-icons/fa'
import { Alert, Button } from 'react-bootstrap'
import { rematch } from '../../clients/game-client'
import { useTranslation } from 'react-i18next'
import { getEndingMessage } from './GameEndedLogic'

const King = ({ style, result }) => {
    const piece = (result === "d" ? "rand" : result + "k")
    return <div className="EndedKing" style={{ backgroundImage: `url('${process.env.PUBLIC_URL}/assets/${piece}.svg')`, ...style }} />
}

export default function GameEndedDialog({ show, onHide = a => a, onNewGame = a => a }) {
    const { t } = useTranslation()
    const { user, apiKey } = useAuth()
    const { game } = useGame()
    const [error, setError] = useState(null)

    const create = (e) => {
        e.preventDefault()
        rematch(user, game, apiKey)
            .then(onNewGame)
            .then(onHide)
            .catch(e => setError(e.message))
    }

    if (!game) {
        return <></>
    }

    const message = getEndingMessage(game, t)

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
                        {message.msg}
                    </div>
                    <div style={{ fontSize: "0.9em" }}>
                        {message.detail}
                    </div>
                </div>
            </div>
            {([game?.whiteId, game?.blackId].includes(user?.id)) &&
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                    <Button onClick={create}>
                        <span>{t("rematch")}</span><FaRedo className='ml-2' />
                    </Button>
                </div>}
            {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
        </Modal.Body>
    </Modal>
}