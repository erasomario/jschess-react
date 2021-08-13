import { FaUserEdit } from "react-icons/fa"
import "./drawerButtons.css"

const EditUserButton = ({ onEditClicked }) => {
    return <div onClick={onEditClicked}
        className="DrawerButton">
        <FaUserEdit style={{ margin: "0.1em 0.5em 0 1em" }} /><div>Editar Perfil</div>
    </div>
}

export default EditUserButton