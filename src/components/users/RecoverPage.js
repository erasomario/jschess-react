import { useInput } from '../../hooks/useInput'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { generateRecoveryKey, recoverPassword } from '../../clients/user-client'
import { FaUser, FaLock, FaCopy, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Input from '../Input'
import { useTranslation } from 'react-i18next'
import { LangSwitch } from '../../locales/LangSwitch'

export default function RecoverPage() {
  const { t } = useTranslation()
  const [loginProps, , loginFocus] = useInput("")
  const [keyProps, , keyFocus] = useInput("")
  const [passProps, , passFocus] = useInput("")
  const [passConfProps, , passConfFocus] = useInput("")

  const [error, setError] = useState();
  const [recoveryData, setRecoveryData] = useState(null);
  const [page, setPage] = useState('login');

  useEffect(() => {
    setError()
  }, [page])

  const generateKey = (e) => {
    e.preventDefault();
    if (!loginProps.value) {
      loginFocus()
      setError(t("You should write an email or username"))
    } else {
      generateRecoveryKey(loginProps.value)
        .then(data => {
          setRecoveryData(data)
          setPage('key')
        }).catch(e => setError(e.message))
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
      recoverPassword(recoveryData.id, keyProps.value, passProps.value)
        .then(() => setPage('end'))
        .catch(e => setError(e.message))
    }
  }

  return (
    <div className='p-3 pt-4' style={{
      background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
      height: '100vh'
    }}>

      <Card className="mx-auto dialog">
        <Card.Body>
          <LangSwitch style={{ position: "absolute", right: "1.2em" }} />
          <Card.Title>
            {(page === 'login' || page === 'end') && <Link to="/login"><FaArrowLeft className='mr-2' /></Link>}
            {page === 'key' && <FaArrowLeft className='mr-2 text-primary' style={{ cursor: "pointer" }} onClick={() => setPage('login')} />}
            <span className='align-middle'>
              {t("recover password")}
            </span>
          </Card.Title>

          {page === 'login' &&
            <>
              <Card.Text>
                {t("if your forget your access data")}
              </Card.Text>
              <Form onSubmit={generateKey}>
                <Input id='login' label={t("username or email")} {...loginProps} type="text" autoComplete="off">
                  <FaUser />
                </Input>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" className="float-right">
                  <span className='align-middle'>
                    {t("continue")}
                  </span>
                  <FaArrowRight className='ml-2' />
                </Button>
              </Form>
            </>
          }
          {page === 'key' &&
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
                <Button variant="primary" type="submit" className="float-right">
                  <span className='align-middle'>
                    {t("continue")}
                  </span>
                  <FaArrowRight className='ml-2' />
                </Button>
              </Form>
            </>
          }
          {page === 'end' &&
            <>
              <Card.Text>
                {t("your password was successfully changed, now you can use it to login")}
              </Card.Text>
              <Link to="/login"><Button variant="primary">{t("go to login")}</Button></Link>
            </>
          }
        </Card.Body>
      </Card>
    </div>
  )
}