import { Button } from "react-bootstrap"
import { FaStarHalfAlt } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import HelpText from "../../utils/HelpText"

const OfferDrawButton = ({ compact, onClick }) => {

    const { user } = useAuth()
    const { game } = useGame()
    const text = "Ofrecer empate"

    const enabled = (game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button disabled={!enabled} variant="primary" onClick={onClick}>
                    <FaStarHalfAlt style={{ marginTop: -4 }} ></FaStarHalfAlt>
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={() => { if (enabled) { onClick() } }} disabled={!enabled}
            className="DrawerButton">
            <FaStarHalfAlt style={{ margin: "0.1em 0.5em 0 1em" }} /><div>{text}</div>
        </div>
    }
}

export default OfferDrawButton