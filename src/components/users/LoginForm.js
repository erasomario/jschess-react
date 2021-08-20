import { Trans, useTranslation } from "react-i18next"
import { useHistory, useLocation } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Input from '../Input'
import { FaDoorOpen, FaUser, FaLock } from "react-icons/fa"
import { useInput } from '../../hooks/useInput'
import { useCheckbox } from '../../hooks/useCheckbox'
import { useEffect, useState } from "react"
import { useAuth } from "../../providers/ProvideAuth"
import { createGuest } from "../../clients/user-client"
import IconWaitButton from "../../utils/IconWaitButton"

export function LoginForm({ compact, onPageChanged }) {

    const { t, i18n } = useTranslation()
    const history = useHistory()
    const location = useLocation()
    const { user, signIn, loggedIn } = useAuth()
    const { from } = location.state || { from: { pathname: "/" } }

    const [loginProps, , loginFocus] = useInput("")
    const [passProps, , passFocus] = useInput("")
    const [remembersProps] = useCheckbox(true)
    const [working, setWorking] = useState(false)
    const [error, setError] = useState()

    useEffect(() => {
        if (user) {
            history.replace(from)
        }
    }, [user, from, history])

    useEffect(() => {
        loginFocus()
    }, [loginFocus])

    useEffect(() => {
        setError()
    }, [i18n.language])

    const login = e => {
        e.preventDefault()
        if (!loginProps.value) {
            loginFocus()
            setError(t("You should write an email or username"))
        } else if (!passProps.value) {
            passFocus()
            setError(t("You should write a password"))
        } else {
            setWorking(true)
            signIn(loginProps.value, passProps.value, i18n.language, remembersProps.checked)
                .then(() => history.replace(from))
                .catch(error => setError(error.message))
                .finally(() => setWorking(false))
        }
    }

    const guestClicked = () => {
        createGuest(i18n.language)
            .then(user => loggedIn(user))
            .then(() => history.replace(from))
            .catch(error => setError(error.message))
    }

    return <div>
        <div style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "600", fontSize: "1.3em",
            marginTop: (compact ? "0em" : "1.3em"),
            marginBottom: "0.5em",
        }}>
            <div>{t("Login")}</div>
        </div>
        <p>
            <Trans i18nKey={compact ? "if you dont have an acount short" : "if you dont have an acount long"}>
                <span className="loginLink" onClick={() => onPageChanged("register")} ></span>
            </Trans>
        </p>
        <Form onSubmit={login}>
            <Input id="login" label={t("username or email")} {...loginProps} type="text" ><FaUser /></Input>
            <Input id="password" label={t("password")} {...passProps} type="password" ><FaLock /></Input>
            <Form.Group controlId="remember" style={{ userSelect: 'none' }}>
                <Form.Check type="checkbox" {...remembersProps} custom label={t("Remember me on this computer")} />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div style={{ margin: "1em 0 1em 0" }}>
                {process.env.NODE_ENV === 'development' &&
                    <div className="loginLink mb-1" onClick={() => onPageChanged("translation")}>{t("create translation")}</div>
                }
                <div className="loginLink mb-1" onClick={() => onPageChanged("recover")}>{t("I forgot my username or password")}</div>
                <div className="loginLink" onClick={guestClicked} >{t("i want to login as guest")}</div>
            </div>



            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconWaitButton type="submit" label={t("continue")} working={working}>
                    <FaDoorOpen />
                </IconWaitButton>

            </div>
        </Form>
    </div>
}