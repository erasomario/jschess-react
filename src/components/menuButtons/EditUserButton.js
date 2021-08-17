import { useTranslation } from "react-i18next"
import { FaUserEdit } from "react-icons/fa"

const EditUserButton = ({ onEditClicked }) => {
    const {t} = useTranslation()
    return <div onClick={onEditClicked}
        className="DrawerButton">
        <FaUserEdit className="icon" /><div>{t("edit account")}</div>
    </div>
}

export default EditUserButton