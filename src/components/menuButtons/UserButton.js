import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { FaSignOutAlt, FaUserEdit, FaUserPlus } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"

const UserButton = ({ onEditClicked, style }) => {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  const logout = (e) => {
    e.preventDefault()
    signOut(() => { })
  }

  return <div style={style}>
    <DropdownButton as={ButtonGroup} title={user.username} variant="link" menuAlign="right">
      <Dropdown.Item onClick={() => onEditClicked()}>
        {!user.guest && <><FaUserEdit className="mr-2" />{t("edit account")}</>}
        {user.guest && <><FaUserPlus className="mr-2" />{t("become user")}</>}
      </Dropdown.Item>
      <Dropdown.Item onClick={logout}><FaSignOutAlt className="mr-2" />{t("logout")}</Dropdown.Item>
    </DropdownButton>
  </div>
}

export default UserButton