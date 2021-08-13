import { Button } from "react-bootstrap"
import { FaFlag } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import HelpText from "../../utils/HelpText"

const SurrenderButton = ({ onClick, compact }) => {

    const { user } = useAuth()
    const { game } = useGame()
    const text = "Rendirse"

    const enabled = (game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button disabled={!enabled} variant="primary" onClick={onClick}>
                    <FaFlag style={{ marginTop: -4 }} ></FaFlag>
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={() => { if (enabled) { onClick() } }} disabled={!enabled}
            className="DrawerButton">
            <FaFlag style={{ margin: "0.1em 0.5em 0 1em" }} /><div>{text}</div>
        </div>
    }

}
export default SurrenderButton