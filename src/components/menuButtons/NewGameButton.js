import { Button } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import HelpText from "../../utils/HelpText"
import "./drawerButtons.css"

const NewGameButton = ({ compact, onClick }) => {
    const text = "Nueva Partida"
    if (compact) {
        return <>
            <HelpText message={text}>
                <Button variant="primary" onClick={onClick}><FaPlus style={{ marginTop: -4 }} ></FaPlus></Button>
            </HelpText>
        </>
    } else {
        return <div onClick={onClick}
            className="DrawerButton">
            <FaPlus style={{ margin: "0.1em 0.5em 0 1em" }} /><div>{text}</div>
        </div>

    }
}

export default NewGameButton