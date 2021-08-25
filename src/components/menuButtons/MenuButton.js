import { useEffect, useState } from "react"
import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { FaBars, FaCog, FaInfo } from "react-icons/fa"
import "./OpenGameButton.css"

function MenuButton({ onMenuClick, onCfgClick, onEndInfoClick, showCfgBtn, notNotifiedCount }) {
    const { t } = useTranslation()
    const [dot, setDot] = useState(false)

    useEffect(() => {
        if (notNotifiedCount > 0) {
            const timer = setInterval(() => {
                setDot(b => !b)
            }, 1000)
            return () => { clearInterval(timer) }
        } else {
            setDot(false)
        }
    }, [notNotifiedCount, t])


    if (showCfgBtn) {
        return <div style={{ display: "flex", fontSize: '2.1vh' }}>
            {onEndInfoClick && <>
                <button className="movBtn" onClick={onEndInfoClick}  >
                    <FaInfo className="movBtnIcon" />
                </button>
            </>}
            <button className="movBtn" onClick={onCfgClick}  >
                <FaCog className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={onMenuClick} style={{ position: "relative" }} >
                <FaBars className="movBtnIcon" />
                <div className={"OpenGameButtonRedDot " + (dot ? "shown" : "hidden")}></div>
            </button>
        </div>
    } else {
        return <Button size="lg" style={{ position: "relative" }} variant="primary" onClick={onMenuClick}>
            <FaBars style={{ marginTop: -4 }} ></FaBars>
        </Button>
    }
}

export default MenuButton