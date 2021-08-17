import { useTranslation } from "react-i18next"
import { FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"

const ExitButton = () => {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const logout = () => {
    signOut(() => { })
  }

  return <div onClick={() => logout()}
    className="DrawerButton">
    <FaSignOutAlt className="icon" /><div>{t("logout")}</div>
  </div>
}

export default ExitButton