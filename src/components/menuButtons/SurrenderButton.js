import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { FaFlag } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"
import { useGame } from "../../providers/ProvideGame"
import HelpText from "../../utils/HelpText"

const SurrenderButton = ({ onClick, compact }) => {

    const { t } = useTranslation()
    const { user, apiKey } = useAuth()
    const { game } = useGame()
    const text = t("surrender")

    const enabled = (game && (game.movs.length >= 2 && !game.result && (user?.id === game?.whiteId || user?.id === game?.blackId)))

    if (compact) {
        return <>
            <HelpText message={text}>
                <Button size="lg" disabled={!enabled} variant="primary" onClick={onClick}>
                    <FaFlag style={{ marginTop: -4 }} ></FaFlag>
                </Button>
            </HelpText>
        </>
    } else {
        return <div onClick={() => { if (enabled) { onClick() } }} disabled={!enabled}
            className="DrawerButton">
            <FaFlag className="icon" /><div>{text}</div>
        </div>
    }

}
export default SurrenderButton