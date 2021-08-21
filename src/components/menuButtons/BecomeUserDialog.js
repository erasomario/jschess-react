import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'
import { FaUserPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '../../providers/ProvideAuth'
import RegisterForm from '../users/RegisterForm'

export default function BecomeUserDialog({ show, onHide = a => a, guestId }) {
    const { t } = useTranslation()
    const { loggedIn } = useAuth()

    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FaUserPlus style={{ marginRight: "0.3em" }} />
                <div>{t("become user")}</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <RegisterForm guestId={guestId}
                onUserCreated={user => {
                    loggedIn(user)
                    onHide()
                    toast.success(t("welcome! your account was successfully created"))
                }}

            ></RegisterForm>
        </Modal.Body>
    </Modal>
}