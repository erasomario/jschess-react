import { Button } from "react-bootstrap"
import { FaPlus } from "react-icons/fa"
import HelpText from "../../utils/HelpText"
import { useTranslation } from "react-i18next"

const NewGameButton = ({ compact, onClick }) => {    
    const { t } = useTranslation()
    const text = t("new game")
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