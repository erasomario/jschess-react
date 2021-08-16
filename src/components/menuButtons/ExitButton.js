import { FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"

const ExitButton = () => {
  const { signOut } = useAuth()
  const logout = () => {
    signOut(() => { })
  }

  return <div onClick={() => logout()}
    className="DrawerButton">
    <FaSignOutAlt className="icon" /><div>Salir</div>
  </div>
}

export default ExitButton