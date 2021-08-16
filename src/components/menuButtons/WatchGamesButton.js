import { Button } from "react-bootstrap"
import { FaBinoculars } from "react-icons/fa"
import HelpText from "../../utils/HelpText"

function WatchGamesButton({ compact, onClick }) {

    const text = "Ver partidas en vivo"

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button style={{ position: "relative" }} variant="primary" onClick={onClick}>
                    <FaBinoculars style={{ marginTop: -4 }} />
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={onClick}
            className="DrawerButton">
            <FaBinoculars className="icon" /><div>{text}</div>
        </div>
    }
}

export default WatchGamesButton