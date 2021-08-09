import { useState } from "react"
import { Button } from "react-bootstrap"
import { FaGlasses } from "react-icons/fa"
import CurrentGamesList from "./CurrentGamesList"

function OpenCurrentGamesButton() {
    const [showDialog, setShowDialog] = useState(false)
    return <>
        <CurrentGamesList show={showDialog} onHide={() => { setShowDialog(false) }}></CurrentGamesList>
        <Button style={{ position: "relative" }} variant="primary" onClick={() => setShowDialog(true)}>
            <FaGlasses style={{ marginTop: -4 }} ></FaGlasses>
        </Button>
    </>
}

export default OpenCurrentGamesButton