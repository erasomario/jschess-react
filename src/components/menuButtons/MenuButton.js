import { Button } from "react-bootstrap"
import { FaBars, FaCog, FaInfo } from "react-icons/fa"

function MenuButton({ onMenuClick, onCfgClick, onEndInfoClick, showCfgBtn }) {
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
            <button className="movBtn" onClick={onMenuClick}  >
                <FaBars className="movBtnIcon" />
            </button>
        </div>
    } else {
        return <Button size="lg" style={{ position: "relative" }} variant="primary" onClick={onMenuClick}>
            <FaBars style={{ marginTop: -4 }} ></FaBars>
        </Button>
    }
}

export default MenuButton