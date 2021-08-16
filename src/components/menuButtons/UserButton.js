import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap"
import { useAuth } from "../../providers/ProvideAuth"

const UserButton = ({ onEditClicked, style }) => {
  const { user, signOut } = useAuth()

  const logout = (e) => {
    e.preventDefault()
    signOut(() => { })
  }

  return <div style={style}>
    <DropdownButton as={ButtonGroup} title={user.username} variant="link" menuAlign="right">
      <Dropdown.Item onClick={() => onEditClicked()}>Editar Perfil</Dropdown.Item>
      <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
    </DropdownButton>
  </div>
}

export default UserButton