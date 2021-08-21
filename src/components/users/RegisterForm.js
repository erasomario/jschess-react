import { useInput } from '../../hooks/useInput'
import { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Input from '../Input'
import { FaUser, FaLock, FaEnvelope, FaCopy, FaArrowLeft, FaUserPlus } from 'react-icons/fa'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { addUser } from '../../clients/user-client'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../providers/ProvideAuth'
import { toast } from 'react-toastify'
import IconWaitButton from '../../utils/IconWaitButton'

export default function RegisterForm({ compact, onPageChanged, onUserCreated = a => a, guestId = null }) {
    const { t, i18n } = useTranslation()
    
    const [file, setFile] = useState(null)
    const [usernameProps, , usernameFocus] = useInput("")
    const [emailProps, , mailFocus] = useInput("")
    const [passProps, , passFocus] = useInput("")
    const [passConfProps, , passConfFocus] = useInput("")

    const [working, setWorking] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        setError(null)
    }, [i18n.language])

    useEffect(() => {
        usernameFocus()
    }, [usernameFocus])

    const register = e => {
        e.preventDefault()
        if (!usernameProps.value) {
            usernameFocus()
            setError(t("you should write a username"))
        } else if (!emailProps.value) {
            mailFocus()
            setError(t("you should write an email"))
        } else if (!passProps.value) {
            passFocus()
            setError(t("you should write a password"))
        } else if (!passConfProps.value) {
            passConfFocus()
            setError(t("you should write a password confirmation"))
        } else if (passProps.value !== passConfProps.value) {
            passConfFocus()
            setError(t("password and its confirmation doesnt match"))
        } else {
            setWorking(true)
            addUser(usernameProps.value, emailProps.value, passProps.value, i18n.language, guestId, file)
                .then(onUserCreated)
                .catch(error => setError(error.message))
                .finally(() => setWorking(false))
        }
    }

    return (
        <>
            {onPageChanged && <div style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "600", fontSize: "1.3em",
                marginTop: (compact ? "0em" : "1.3em"),
                marginBottom: "0.5em",
            }}>
                <FaArrowLeft className="loginLink mr-2 mt-1" onClick={() => onPageChanged("login")} />
                <div>{t("create account")}</div>
            </div>}
            <p>{t("you can create an account with")}:</p>
            <Form onSubmit={register}>
                <Input autoComplete="off" id="username" label={t("username")} type="text" {...usernameProps} >
                    <FaUser />
                </Input>
                <Input autoComplete="off" id="email" label='Email' type="email"
                    placeholder={t("to recover your account if you forget your password")} {...emailProps} >
                    <FaEnvelope />
                </Input>
                <Input id="password" label={t("password")} type="password"
                    placeholder={t("password that youll use to login")} {...passProps} >
                    <FaLock />
                </Input>
                <Input id="conf" label={t("password confirmation")} type="password"
                    placeholder={t("repeat your password")} {...passConfProps} >
                    <FaCopy />
                </Input>

                <Form.Group controlId="picture" className="mb-3">
                    <Form.Label>{t("profile picture (optional)")}</Form.Label>
                    <Form.File
                        label={file?.name || ''}
                        data-browse={t("choose")}
                        accept="image/png, image/gif, image/jpeg"
                        custom
                        onChange={event => {
                            setFile(event.target.files[0])
                        }}
                    />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}

                <div style={{ margin: "2em 0 0.5em 0", display: "flex", justifyContent: "flex-end" }}>
                    <IconWaitButton type="submit" label={t("create account")} working={working}>
                        <FaUserPlus />
                    </IconWaitButton>
                </div>
            </Form>
        </>
    )
}