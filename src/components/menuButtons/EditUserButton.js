import { FaUserEdit } from "react-icons/fa"

const EditUserButton = ({ onEditClicked }) => {
    return <div onClick={onEditClicked}
        className="DrawerButton">
        <FaUserEdit className="icon" /><div>Editar Perfil</div>
    </div>
}

export default EditUserButton