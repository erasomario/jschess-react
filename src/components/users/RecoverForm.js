import { useInput } from '../../hooks/useInput'
import { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { generateRecoveryKey, recoverPassword } from '../../clients/user-client'
import { FaUser, FaLock, FaCopy, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Input from '../Input'
import { useTranslation } from 'react-i18next'
import IconWaitButton from '../../utils/IconWaitButton'
import { toast } from 'react-toastify'

export default function RecoverForm({ compact, onPageChanged }) {
  const { t, i18n } = useTranslation()

  const [loginProps, , loginFocus] = useInput("")
  const [keyProps, , keyFocus] = useInput("")
  const [passProps, , passFocus] = useInput("")
  const [passConfProps, , passConfFocus] = useInput("")

  const [working, setWorking] = useState(false)
  const [error, setError] = useState()
  const [recoveryData, setRecoveryData] = useState(null)
  const [page, setPage] = useState('login')

  useEffect(() => {
    setError()
  }, [page, i18n.language])
  
  const generateKey = (e) => {
    e.preventDefault();
    if (!loginProps.value) {
      loginFocus()
      setError(t("You should write an email or username"))
    } else {
      setWorking(true)
      generateRecoveryKey(loginProps.value, i18n.language)
        .then(data => {
          setRecoveryData(data)
          setPage('key')
        })
        .catch(e => setError(e.message))
        .finally(() => setWorking(false))
    }
  }

  let sendKey = (e) => {
    e.preventDefault();
    if (!keyProps.value) {
      keyFocus()
      setError(t("you should write the key you got on your mail"))
    } else if (!passProps.value) {
      passFocus()
      setError(t("you should write a new password"))
    } else if (!passConfProps.value) {
      passConfFocus()
      setError(t("you should write a password confirmation"))
    } else if (passProps.value !== passConfProps.value) {
      passConfFocus()
      setError(t("password and its confirmation doesnt match"))
    } else {
      setWorking(true)
      recoverPassword(recoveryData.id, keyProps.value, passProps.value)
        .then(() => onPageChanged("login"))
        .then(() => toast.success(t("your password was changed successfully")))
        .catch(error => setError(error.message))
        .finally(() => setWorking(false))
    }
  }

  return <>
    <div style={{
      display: "flex",
      alignItems: "center",
      fontWeight: "600", fontSize: "1.3em",
      marginTop: (compact ? "0em" : "1.3em"),
      marginBottom: "0.5em",
    }}>
      {(page === 'login' || page === 'end') &&
        <FaArrowLeft className="loginLink mr-2 mt-1" onClick={() => onPageChanged("login")} />}
      {(page === 'key') &&
        <FaArrowLeft className="loginLink mr-2 mt-1" onClick={() => setPage('login')} />}
      <div>{t("recover password")}</div>
    </div>

    {
      page === 'login' &&
      <>
        <p className="mb-4">{t("if your forget your access data")}</p>
        <Form onSubmit={generateKey}>
          <Input id='login' label={t("username or email")} {...loginProps} type="text" autoComplete="off">
            <FaUser />
          </Input>
          {error && <Alert variant="danger">{error}</Alert>}
          <div style={{ margin: "5em 0 1em 0", display: "flex", justifyContent: "flex-end" }}>
            <IconWaitButton type="submit" label={t("continue")} working={working}>
              <FaArrowRight />
            </IconWaitButton>
          </div>
        </Form>
      </>
    }
    {
      page === 'key' &&
      <>
        <Card.Text>
          {t("your username and a {{num}} characters key was sent to your email {{email}}", { num: recoveryData.keyLenght, email: recoveryData.mail })}
        </Card.Text>
        <Form onSubmit={sendKey}>
          <Input autoComplete='off' id='key' label={t("key")} {...keyProps} type='text' placeholder={t("num characters key you got on your mail", { num: recoveryData.keyLenght })} >
            <FaLock />
          </Input>

          <Input id='pass' label={t("new password")} {...passProps} type='password' placeholder={t("new password you'll use to login")} >
            <FaLock />
          </Input>

          <Input id='conf' label={t("new passwords confirmation")} {...passConfProps} type='password' placeholder={t("repeat the new password")} >
            <FaCopy />
          </Input>

          {error && <Alert variant="danger">{error}</Alert>}
          <div style={{ margin: "2em 0 0.5em 0", display: "flex", justifyContent: "flex-end" }}>
            <IconWaitButton type="submit" label={t("continue")} working={working}>
              <FaArrowRight />
            </IconWaitButton>
          </div>
        </Form>
      </>
    }

  </>
}