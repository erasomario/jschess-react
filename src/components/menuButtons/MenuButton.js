import { Button } from "react-bootstrap"
import { FaBars, FaCog, FaRedo } from "react-icons/fa"

function MenuButton({ onMenuClick, onCfgClick, onRematchClick, showCfgBtn }) {
    if (showCfgBtn) {
        return <div style={{ display: "flex", fontSize: '2.1vh' }}>
            {onRematchClick && <button className="movBtn" onClick={onRematchClick}  >
                <FaRedo className="movBtnIcon" />
            </button>}
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