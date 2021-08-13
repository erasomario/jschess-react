import { Button } from "react-bootstrap"
import { FaGlasses } from "react-icons/fa"
import HelpText from "../../utils/HelpText"

function OpenCurrentGamesButton({ compact, onClick }) {

    const text = "Ver partidas en vivo"

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button style={{ position: "relative" }} variant="primary" onClick={onClick}>
                    <FaGlasses style={{ marginTop: -4 }} />
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={onClick}
            className="DrawerButton">
            <FaGlasses style={{ margin: "0.1em 0.5em 0 1em" }} /><div>{text}</div>
        </div>
    }
}

export default OpenCurrentGamesButton