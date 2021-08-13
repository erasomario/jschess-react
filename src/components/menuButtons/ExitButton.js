import { FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../../providers/ProvideAuth"

const ExitButton = () => {
  const { signOut } = useAuth()
  const logout = () => {
    signOut(() => { })
  }

  return <div onClick={() => logout()}
    className="DrawerButton">
    <FaSignOutAlt style={{ margin: "0.1em 0.5em 0 1em" }} /><div>Salir</div>
  </div>
}

export default ExitButton