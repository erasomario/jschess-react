import { useEffect, useState } from "react"
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap"
import { getProfilePictureUrl } from "../../clients/user-client"
import { useAuth } from "../../providers/ProvideAuth"

const UserButton = ({ onEditClicked }) => {

  const [pictureUrl, setPictureUrl] = useState()
  const { user, signOut } = useAuth()

  const logout = (e) => {
    e.preventDefault()
    signOut(() => { })
  }

  useEffect(() => {
    user && getProfilePictureUrl(user.id, user.hasPicture, user.api_key).then(setPictureUrl)
  }, [user])

  return <>
    <DropdownButton as={ButtonGroup} title={user.username} variant="link">
      <Dropdown.Item onClick={() => onEditClicked()}>Editar Perfil</Dropdown.Item>
      <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
    </DropdownButton>
    <img alt="" src={pictureUrl} style={{ borderRadius: '50%', width: "2em", height: "2em" }} /></>
}

export default UserButton