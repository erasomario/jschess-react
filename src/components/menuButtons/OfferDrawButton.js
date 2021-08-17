import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { FaStarHalfAlt } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import HelpText from "../../utils/HelpText"

const OfferDrawButton = ({ compact, onClick }) => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const { game } = useGame()
    const text = t("offer draw")

    const enabled = (game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button size="lg" disabled={!enabled} variant="primary" onClick={onClick}>
                    <FaStarHalfAlt style={{ marginTop: -4 }} ></FaStarHalfAlt>
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={() => { if (enabled) { onClick() } }} disabled={!enabled}
            className="DrawerButton">
            <FaStarHalfAlt className="icon"/><div>{text}</div>
        </div>
    }
}

export default OfferDrawButton