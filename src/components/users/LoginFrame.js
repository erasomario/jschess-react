import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChessKnight } from "react-icons/fa"
import { useDimensions } from "../../hooks/useDimensions"
import { LangSwitch } from '../../locales/LangSwitch'
import { LoginForm } from './LoginForm'
import "./LoginFrame.scss"
import './dialogs.css'
import RegisterForm from './RegisterForm'
import RecoverForm from './RecoverForm'
import CreateTranslation from './CreateTranslation'
import { toast } from 'react-toastify'
import { useHistory, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/ProvideAuth'

export default function LoginFrame() {

  const GREET_TIME = 9000
  const history = useHistory()
  const location = useLocation()
  const { loggedIn } = useAuth()
  const { from } = location.state || { from: { pathname: "/" } }

  const windowDimensions = useDimensions()
  const { t } = useTranslation()
  const greetRef = useRef()
  const greetTimer = useRef()
  const [curCard, setCurCard] = useState(0)
  const [page, setPage] = useState("login")

  const cards = [
    { p1: t("mario's chess combines my interest"), p2: t("thanks for your visit"), p3: "Mario Raúl Eraso" },
    { p1: t("on mario’s chess you can play against friends"), p2: t("there's always a game to play!"), p3: "" },
    { p1: t("mario’s chess is made with responsiveness"), p2: t("enjoy it at home or on the go!"), p3: "" },
    { p1: t("mario’s chess was built from scratch using javascript"), p2: t("mario's cheess is opensource"), p3: "" },
  ]

  const setGreet = i => {
    clearTimeout(greetTimer.current)
    if (greetRef.current) {
      greetRef.current.style.opacity = "0"
      setTimeout(() => {
        setCurCard(i)
        greetRef.current.style.opacity = "1"
      }, 275)
    }
    greetTimer.current = setTimeout(nextGreet, GREET_TIME)
  }

  const nextGreet = useCallback(() => {
    clearTimeout(greetTimer.current)
    if (greetRef.current) {
      greetRef.current.style.opacity = "0"
      setTimeout(() => {
        setCurCard(c => c < cards.length - 1 ? c + 1 : 0)
        greetRef.current.style.opacity = "1"
      }, 275)
    }
    greetTimer.current = setTimeout(nextGreet, GREET_TIME)
  }, [cards.length])

  useEffect(() => {
    greetTimer.current = setTimeout(nextGreet, GREET_TIME)
    return () => { clearTimeout(greetTimer.current) }
  }, [nextGreet])

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

  return (
    <div className='p-3 pt-4' style={{
      background: 'linear-gradient(180deg, #8e9eab -20%, #eef2f3 100%)',
      minHeight: '100vh',
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
                <span style={{ fontWeight: "600", fontSize: "1.3em" }}>Mario's Chess</span>
              </p>
              <div className="loginGreeting" ref={greetRef}>
                <p>{cards[curCard].p1}</p>
                <p>{cards[curCard].p2}</p>
                <p style={{ textAlign: "right" }}>{cards[curCard].p3}</p>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: "1.2em", width: "calc(100% - 2.4em)" }}>
              <div style={{ margin: "auto", width: "max-content", display: "flex" }}>
                {[...Array(cards.length)].map((e, i) =>
                  <div key={i} className="loginGreetingDot"
                    style={{
                      opacity: i === curCard ? "0.75" : "0.1",
                      cursor: i === curCard ? "default" : "pointer"
                    }}
                    onClick={() => setGreet(i)}
                  ></div>
                )}
              </div>
            </div>
          </div>}
          <div style={{ width: (compact ? "100%" : "60%"), padding: "1.2em", position: "relative" }}>
            <LangSwitch style={{ position: "absolute", right: "1.2em" }} />
            {page === "login" && <LoginForm onPageChanged={setPage} compact={compact}></LoginForm>}
            {page === "register" && <RegisterForm
              onPageChanged={setPage} compact={compact}
              onUserCreated={user => {
                loggedIn(user)
                history.replace(from)
                toast.success(t("welcome! your account was successfully created"))
              }}
            ></RegisterForm>}
            {page === "recover" && <RecoverForm onPageChanged={setPage} compact={compact}></RecoverForm>}
            {page === "translation" && <CreateTranslation onPageChanged={setPage} compact={compact} />}
          </div>
        </div>
      </div>
    </div>
  )
}