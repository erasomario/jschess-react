import { Button } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import HelpText from "../../utils/HelpText"

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
            <FaPlus className="icon" /><div>{text}</div>
        </div>

    }
}

export default NewGameButton