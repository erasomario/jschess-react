import { Button } from "react-bootstrap"
import { FaBars } from "react-icons/fa"

function MenuButton({ onClick }) {
    return <Button style={{ position: "relative" }} variant="primary" onClick={onClick}>
        <FaBars style={{ marginTop: -4 }} ></FaBars>
    </Button>
}

export default MenuButton