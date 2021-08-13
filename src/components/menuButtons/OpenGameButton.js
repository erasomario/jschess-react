import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { FaFolderOpen } from "react-icons/fa"
import { toast } from 'react-toastify';
import "./OpenGameButton.css"
import HelpText from "../../utils/HelpText"

function OpenGameButton({ notNotifiedCount, compact, onClick }) {
    const [dot, setDot] = useState()
    const text = "Abrir mis partidas"

    useEffect(() => {
        if (notNotifiedCount > 0) {
            toast.info("Tiene invitaciones por revisar")
            const timer = setInterval(() => {
                setDot(b => !b)
            }, 1000)
            return () => { clearInterval(timer) }
        } else {
            setDot(false)
        }
    }, [notNotifiedCount])

    if (compact) {
        return <>

            <HelpText message={text}>
                <Button style={{ position: "relative" }} variant="primary" onClick={onClick}>
                    <FaFolderOpen style={{ marginTop: -4 }} ></FaFolderOpen>
                    <div className={"OpenGameButtonRedDot " + (dot ? "shown" : "hidden")}></div>
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={onClick}
            className="DrawerButton">
            <FaFolderOpen style={{ margin: "0.1em 0.5em 0 1em" }} /><div>{text}</div>
        </div>
    }
}

export default OpenGameButton