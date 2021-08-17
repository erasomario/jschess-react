import { Button } from "react-bootstrap"
import { FaBars, FaCog } from "react-icons/fa"

function MenuButton({ onMenuClick, onCfgClick, showCfgBtn }) {
    if (showCfgBtn) {
        return <div style={{ display: "flex", fontSize: '2.1vh' }}>
            <button className="movBtn" onClick={onCfgClick}  >
                <FaCog className="movBtnIcon" />
            </button>
            <button className="movBtn" onClick={onMenuClick}  >
                <FaBars className="movBtnIcon" />
            </button>
        </div>
    } else {
        return <Button style={{ position: "relative" }} variant="primary" onClick={onMenuClick}>
            <FaBars style={{ marginTop: -4 }} ></FaBars>
        </Button>
    }
}

export default MenuButton