import { useState } from "react"
import { Button } from "react-bootstrap"
import { FaGlasses } from "react-icons/fa"
import WatchGamesList from "./WatchGamesList"

function OpenCurrentGamesButton() {
    const [showDialog, setShowDialog] = useState(false)
    return <>
        <WatchGamesList show={showDialog} onHide={() => { setShowDialog(false) }}></WatchGamesList>
        <Button style={{ position: "relative" }} variant="primary" onClick={() => setShowDialog(true)}>
            <FaGlasses style={{ marginTop: -4 }} ></FaGlasses>
        </Button>
    </>
}

export default OpenCurrentGamesButton