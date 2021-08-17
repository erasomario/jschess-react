import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../providers/ProvideAuth"

const UserButton = ({ onEditClicked, style }) => {
  const {t} = useTranslation()
  const { user, signOut } = useAuth()

  const logout = (e) => {
    e.preventDefault()
    signOut(() => { })
  }

  return <div style={style}>
    <DropdownButton as={ButtonGroup} title={user.username} variant="link" menuAlign="right">
      <Dropdown.Item onClick={() => onEditClicked()}>{t("edit account")}</Dropdown.Item>
      <Dropdown.Item onClick={logout}>{t("logout")}</Dropdown.Item>
    </DropdownButton>
  </div>
}

export default UserButton