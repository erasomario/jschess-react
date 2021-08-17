import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { FaFolderOpen } from "react-icons/fa"
import { toast } from 'react-toastify';
import "./OpenGameButton.css"
import HelpText from "../../utils/HelpText"
import { useTranslation } from "react-i18next";

function OpenGameButton({ notNotifiedCount, compact, onClick }) {
    const { t } = useTranslation()
    const [dot, setDot] = useState()
    const text = t("open my games")

    useEffect(() => {
        if (notNotifiedCount > 0) {
            toast.info(t("you have invitations to check"))
            const timer = setInterval(() => {
                setDot(b => !b)
            }, 1000)
            return () => { clearInterval(timer) }
        } else {
            setDot(false)
        }
    }, [notNotifiedCount, t])

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
            <FaFolderOpen className="icon" /><div>{text}</div>
        </div>
    }
}

export default OpenGameButton