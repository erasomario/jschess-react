import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import { FaCamera, FaUser, FaLock, FaEnvelope, FaCopy, FaCheck, FaWindowClose } from 'react-icons/fa'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useAuth } from '../../providers/ProvideAuth'
import { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'

import './EditUserDialog.css'
import {
    editUsername,
    editPassword,
    getProfilePictureUrl,
    removeProfilePicture,
    updateProfilePicture,
    editEmail
} from '../../clients/user-client'
import Input from '../Input'
import { toast } from 'react-toastify'
import { Alert, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { LangSwitch } from '../../locales/LangSwitch'

export default function EditPage({ show, onHide = a => a }) {
    const { t } = useTranslation()
    const { user, key, refreshKey } = useAuth()
    const [pictureUrl, setPictureUrl] = useState()
    const [origPassProps, setOrigPass, origPassFocus] = useInput()
    const [usernameProps, setUsername, usernameFocus] = useInput()
    const [emailProps, , emailFocus] = useInput()
    const [passProps, , passFocus] = useInput()
    const [passConfProps, , passConfFocus] = useInput()
    const [error, setError] = useState()
    const [page, setPage] = useState(null)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        setError()
    }, [page])

    useEffect(() => {
        if (!show) {
            setPage()
            setError()
        } else {
            getProfilePictureUrl(user.id, user.hasPicture, user.api_key).then(setPictureUrl)
                .catch(e => toast.error(e.message))
            setUsername(user.username)
        }
    }, [show, user, setUsername])

    const removePp = () => {
        removeProfilePicture(user)
            .then(() => refreshKey(key))
            .catch(e => toast.error(e.message))
    }

    const updatePp = file => {
        if (file) {
            setUploading(true)
            updateProfilePicture(user, file)
                .then(() => refreshKey(key))
                .catch(e => toast.error(e.message))
                .finally(() => setUploading(false))
        }
    }

    const save = async (e) => {
        e.preventDefault()
        try {
            if (!origPassProps.value) {
                origPassFocus()
                throw Error(t("you should write your current password"))
            }
            if (page === 'username') {
                if (!usernameProps.value) {
                    usernameFocus()
                    throw Error(t("you should write a new username"))
                }
                await editUsername(user, origPassProps.value, usernameProps.value)
                toast.success(t("username was successfully changed"))
            } else if (page === 'password') {
                if (!passProps.value) {
                    passFocus()
                    throw Error(t("you should write a new password"))
                } else if (!passConfProps.value) {
                    passConfFocus()
                    throw Error(t("you should write new passwords confirmation"))
                } else if (passProps.value !== passConfProps.value) {
                    passConfFocus()
                    throw Error(t("new password and its match dont match"))
                }
                await editPassword(user, origPassProps.value, passProps.value)
                toast.success(t("password was successfully changed"))
            } else if (page === 'email') {
                if (!emailProps.value) {
                    emailFocus()
                    throw Error(t("you should write a new email"))
                }
                await editEmail(user, origPassProps.value, emailProps.value)
                toast.success(t("email was successfully changed"))
            }
            setOrigPass('')
            await refreshKey(user.api_key)
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <Modal show={show} onHide={() => onHide()}>
            <Modal.Header closeButton>
                <Modal.Title>{user?.username}
                    <Button variant="link" onClick={() => { setPage('username') }}>
                        {t("edit")}
                    </Button></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={save}>
                    {user &&
                        <div style={{ display: "flex", flexDirection: "row" }} className='mb-3'>
                            <div style={{ position: "relative" }} className='mr-3'>
                                {user.hasPicture && <FaWindowClose onClick={removePp} style={{ position: 'absolute', right: '0px', cursor: 'pointer' }} />}
                                {!uploading && <img alt="profile_picture" src={pictureUrl} className='pp' />}
                                {uploading && <div className='pp' style={{ backgroundColor: "#1976D2", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                    <Spinner animation="border" variant="light" />
                                </div>}
                                <div className='pb'>
                                    <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                        <div variant="light"><FaCamera className='mr-2 camera' /><span style={{ verticalAlign: 'middle' }}>
                                            {user.hasPicture ? t("change") : t("add")}
                                        </span></div>
                                    </label>
                                </div>
                                <input type="file" id="file-input" accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }}
                                    onChange={event => {
                                        updatePp(event.target.files[0])
                                    }} />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <Button variant="link" onClick={() => setPage('password')}>{t("change password")}</Button>
                                <Button variant="link" onClick={() => setPage('email')}>{t("change email")}</Button>
                                <Button variant="link" onClick={() => setPage('lang')}>{t("change language")}</Button>
                            </div>
                        </div>
                    }

                    {page &&
                        <>
                            {page !== "lang" && <Input id="curPassword" label={t("current password")} type="password"
                                placeholder={t("password you use to login")} {...origPassProps} >
                                <FaLock />
                            </Input>}
                            {page === 'username' && <Input id="username" label={t("username")} type="text" {...usernameProps} autoComplete="off" >
                                <FaUser />
                            </Input>}
                            {page === 'email' && <Input id="email" label='Email' type="email" autoComplete="off"
                                placeholder={t("to recover your account if you forget your password")} {...emailProps} >
                                <FaEnvelope />
                            </Input>}
                            {page === 'password' && <>
                                <Input id="newPassword" label={t("new password")} type="password"
                                    placeholder={t("password you'll use to login")} {...passProps} >
                                    <FaLock />
                                </Input>
                                <Input id="conf" label={t("password confirmation")} type="password"
                                    placeholder={t("repeat your new password")} {...passConfProps} >
                                    <FaCopy />
                                </Input>
                            </>}
                            {page === "lang" &&
                                <LangSwitch user={user} ></LangSwitch>
                            }
                        </>
                    }
                    {error && <Alert variant="danger" className='mt-3'>{error}</Alert>}
                    {page !== "lang" &&
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="primary" disabled={!page} type="submit">
                                {t("save")}
                                <FaCheck className='ml-2' />
                            </Button>
                        </div>}
                </Form>
            </Modal.Body>
        </Modal>
    )
}