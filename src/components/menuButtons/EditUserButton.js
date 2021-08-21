import { useTranslation } from "react-i18next"
import { FaUserEdit, FaUserPlus } from "react-icons/fa"

const EditUserButton = ({ onEditClicked, user }) => {
    const { t } = useTranslation()
    return <div onClick={onEditClicked}
        className="DrawerButton">
        {!user.guest && <><FaUserEdit className="icon" /><div>{t("edit account")}</div></>}
        {user.guest && <><FaUserPlus className="icon" /><div>{t("become user")}</div></>}
    </div>
}

export default EditUserButton