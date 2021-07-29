import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { FaFolderOpen } from "react-icons/fa"
import { findNotNotifiedGamesCount } from "../../controllers/user-client"
import { useAuth } from "../../providers/ProvideAuth"
import { useSocket } from "../../providers/ProvideSocket"
import GamesList from "./GamesList"
import { toast } from 'react-toastify';
import "./OpenGameButton.css"

function OpenGameButton() {
    const { user } = useAuth()
    const [notNotifiedCount, setNotNotifiedCount] = useState([])
    const [dot, setDot] = useState()
    const [showGamesDialog, setShowGamesDialog] = useState(false)
    const { addSocketListener } = useSocket()

    useEffect(() => {
        addSocketListener("opponentNotificationUpdated", c => setNotNotifiedCount(c))
    }, [addSocketListener])

    useEffect(() => {
        if (user) {
            findNotNotifiedGamesCount(user.id, user.api_key)
                .then(c => setNotNotifiedCount(c.count))
                .catch(e => toast.error(e.message))
        }
    }, [user])

    useEffect(() => {
        if (notNotifiedCount > 0) {
            toast.info("Le han invitado a nuevas partidas")
            const timer = setInterval(() => {
                setDot(b => !b)
            }, 1000)
            return () => { clearInterval(timer) }
        } else {
            setDot(false)
        }
    }, [notNotifiedCount])

    return <>
        <GamesList show={showGamesDialog} onHide={() => { setShowGamesDialog(false) }}></GamesList>
        <Button style={{ position: "relative" }} variant="primary" onClick={() => setShowGamesDialog(true)}>
            <FaFolderOpen style={{ marginTop: -4 }} ></FaFolderOpen>
            <div className={"OpenGameButtonRedDot " + (dot ? "shown" : "hidden")}></div>
        </Button>
    </>
}

export default OpenGameButton