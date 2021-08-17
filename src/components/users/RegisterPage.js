import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../Input'
import { FaUser, FaLock, FaEnvelope, FaCopy, FaArrowLeft, FaUserPlus } from 'react-icons/fa'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { addUser } from '../../clients/user-client'
import { LangSwitch } from '../../locales/LangSwitch'
import { useTranslation } from 'react-i18next'

export default function RegisterPage() {
    const { t, i18n } = useTranslation()
    const [file, setFile] = useState(null)
    const [usernameProps, , usernameFocus] = useInput("");
    const [emailProps, , mailFocus] = useInput("");
    const [passProps, , passFocus] = useInput("");
    const [passConfProps, , passConfFocus] = useInput("");

    const [error, setError] = useState();
    const [page, setPage] = useState('create');

    const register = (e) => {
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
            addUser(usernameProps.value, emailProps.value, passProps.value, i18n.language, file)
                .then(() => {
                    setPage('created')
                    setError(null)
                }).catch(e => setError(e.message))
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
                        <Link to="/login"><FaArrowLeft className='mr-2' /></Link>
                        <span className='align-middle'>
                            {t("create account")}
                        </span>
                    </Card.Title>
                    {page === 'create' &&
                        <>
                            <Card.Text>
                                {t("you can create an account with")}:
                            </Card.Text>
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
                                <Button className='float-right' variant="primary" type="submit">
                                    <span className='align-middle'>{t("create account")}</span><FaUserPlus className='ml-2' />
                                </Button>
                            </Form>
                        </>
                    }
                    {page === 'created' &&
                        <>
                            <Card.Text>
                                <b>{usernameProps.value}</b> {t("your account was successfully created")}
                            </Card.Text>
                            <Link to="/login" ><Button variant="primary">{t("go to login")}</Button></Link>
                        </>
                    }
                </Card.Body>
            </Card>
        </div>
    )
}