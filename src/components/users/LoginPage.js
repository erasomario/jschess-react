import { useAuth } from '../../providers/ProvideAuth'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useInput } from '../../hooks/useInput'
import { useCheckbox } from '../../hooks/useCheckbox'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { FaDoorOpen, FaChessKnight, FaUser, FaLock } from "react-icons/fa"
import Input from '../Input'
import './dialogs.css'
import "./LoginPage.scss"
import { useDimensions } from "../../hooks/useDimensions"
import { Trans, useTranslation } from 'react-i18next'
import { LangSwitch } from '../../locales/LangSwitch'
//import CreateTranslation from './CreateTranslation'

export default function LoginPage() {
  const [error, setError] = useState()
  const history = useHistory()
  const { user, signIn } = useAuth()
  const location = useLocation()

  const [loginProps, , loginFocus] = useInput("")
  const [passProps, , passFocus] = useInput("")
  const [remembersProps] = useCheckbox(true)
  const windowDimensions = useDimensions()
  const { from } = location.state || { from: { pathname: "/" } }
  const { t } = useTranslation()

  useEffect(() => {
    if (user) {
      history.replace(from)
    }
  }, [user, from, history])

  useEffect(() => {
    loginFocus()
  }, [loginFocus])

  const login = (e) => {
    e.preventDefault()
    if (!loginProps.value) {
      loginFocus()
      setError(t("You should write an email or username"))
    } else if (!passProps.value) {
      passFocus()
      setError(t("You should write a password"))
    } else {
      signIn(loginProps.value, passProps.value, remembersProps.checked)
        .then(() => history.replace(from))
        .catch(error => setError(error.message))
    }
  }

  let frmWidth
  let compact
  if (windowDimensions.width > 960) {
    frmWidth = "860px"
    compact = false
  } else if (windowDimensions.width > 700) {
    frmWidth = "640px"
    compact = false
  } else {
    compact = true
    frmWidth = "95%"
  }

  useEffect(() => {
    document.body.style.backgroundColor = '#eef2f3'
  }, [])

  return (
    <div className='p-3 pt-4' style={{
      background: 'linear-gradient(180deg, #8e9eab -20%, #eef2f3 100%)',
      height: '100vh',
      userSelect: "none"
    }}>
      <div className="mx-auto" style={{ width: frmWidth, boxShadow: "0 0 3px 1px rgba(0, 0, 0, 0.3)", borderRadius: "0.4em", backgroundColor: "white" }}>
        <div style={{ display: "flex", flexDirection: (compact ? "column" : "row"), borderRadius: "1em" }}>

          {!compact && <div style={{
            position: "relative", width: "40%", padding: "1.2em", color: "white",
            backgroundImage: `url('${process.env.PUBLIC_URL}/assets/pawn.jpg')`,
            backgroundPositionX: "center", backgroundSize: "cover",
            borderTopLeftRadius: "0.4em", borderBottomLeftRadius: "0.4em"
          }}>
            <div className="LoginLeft"
              style={{ borderTopLeftRadius: "0.4em", borderBottomLeftRadius: "0.4em", position: "absolute", width: "100%", height: "100%", top: "0", left: "0" }} ></div>
            <div style={{ position: "relative" }}>
              <div>{t("Welcome to")}</div>
              <p style={{ display: "flex", flexDirection: "row", marginTop: "0.25em" }}>
                <FaChessKnight className='mr-2' style={{ fontSize: "2em" }} />
                <span style={{ fontWeight: "600", fontSize: "1.5em" }}>Mario's Chess</span>
              </p>
              <p>{t("login greeting")}</p>
              <p>{t("thanks for your visit")}</p>
              <p style={{ textAlign: "right" }}>Mario Raúl Eraso</p>
            </div>
          </div>}
          <div style={{ width: (compact ? "100%" : "60%"), padding: "1.2em", position: "relative" }}>
            <LangSwitch style={{ position: "absolute", right: "1.2em" }} />
            <p><span style={{
              fontWeight: "600", fontSize: "1.5em",
              marginTop: (compact ? "0em" : "1.1em"),
              marginBottom: (compact ? "0em" : "1em"),
            }}>{t("Login")}</span></p>
            {compact && <p>
              <Trans i18nKey="if you dont have an acount short">
                <Link to="/register"></Link>
              </Trans>
            </p>}
            {!compact && <p>
              <Trans i18nKey="if you dont have an acount long">
                <Link to="/register"></Link>
              </Trans>
            </p>}
            <Form onSubmit={login}>
              <Input id="login" label={t("username or email")} {...loginProps} type="text" ><FaUser /></Input>
              <Input id="password" label={t("password")} {...passProps} type="password" ><FaLock /></Input>
              <Form.Group controlId="remember" style={{ userSelect: 'none' }}>
                <Form.Check type="checkbox" {...remembersProps} custom label={t("Remember me on this computer")} />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <p><Link to="/recover">{t("I forgot my username or password")}</Link></p>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" type="submit">
                  <span className='align-middle'>
                    {t("continue")}</span>
                  <FaDoorOpen className='ml-2' />
                </Button>
              </div>
            </Form>
            {/*<CreateTranslation></CreateTranslation>*/}
          </div>
        </div>
      </div>
    </div>
  )
}