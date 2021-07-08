import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import { FaCamera, FaUser, FaLock, FaEnvelope, FaCopy, FaCheck, FaWindowClose } from 'react-icons/fa'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
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
} from '../../controllers/user-controller'
import Input from '../Input'

export default function EditPage({ show, onHide = a => a }) {
    const { user, key, refreshKey } = useAuth()
    const [pictureUrl, setPictureUrl] = useState()

    const [origPassProps, setOrigPass, origPassFocus] = useInput()
    const [usernameProps, setUsername, usernameFocus] = useInput()
    const [emailProps, , emailFocus] = useInput()
    const [passProps, , passFocus] = useInput()
    const [passConfProps, , passConfFocus] = useInput()
    const [msg, setMsg] = useState(null)
    const [page, setPage] = useState(null)

    useEffect(() => {
        getProfilePictureUrl(user).then(setPictureUrl).catch(setMsg)
        setUsername(user.username)
    }, [user, setUsername])

    useEffect(() => {
        setError()
    }, [page])

    useEffect(() => {
        if (!show) {
            setPage()
            setError()
        }
    }, [show])

    const setError = (msg) => {
        setMsg(msg ? { msg, type: "danger" } : null)
    }

    const setSuccess = (msg) => {
        setMsg(msg ? { msg, type: "success" } : null)
    }

    const removePp = () => {
        setError()
        removeProfilePicture(user)
            .then(() => { refreshKey(key) })
            .catch(setError)
    }

    const updatePp = (file) => {
        setError()
        file && updateProfilePicture(user, file)
            .then(() => { refreshKey(key) })
            .catch(setError)
    }

    const save = async (e) => {
        e.preventDefault()
        try {
            if (!origPassProps.value) {
                origPassFocus()
                throw Error('Debe escribir la contraseña actual')
            }
            if (page === 'username') {
                if (!usernameProps.value) {
                    usernameFocus()
                    throw Error('Debe escribir un nuevo nombre de usuario')
                }
                await editUsername(user, origPassProps.value, usernameProps.value)
                setSuccess("El nombre de usuario se cambió con éxito")
            } else if (page === 'password') {
                if (!passProps.value) {
                    passFocus()
                    throw Error('Debe escribir una nueva contraseña')
                } else if (!passConfProps.value) {
                    passConfFocus()
                    throw Error('Debe escribir la confirmación de la nueva contraseña')
                } else if (passProps.value !== passConfProps.value) {
                    passConfFocus()
                    throw Error('La nueva contraseña y su confirmación no coinciden')
                }
                await editPassword(user, origPassProps.value, passProps.value)
                setSuccess("La contraseña se cambió con éxito")
            } else if (page === 'email') {
                if (!emailProps.value) {
                    emailFocus()
                    throw Error('Debe escribir un nuevo email')
                }
                await editEmail(user, origPassProps.value, emailProps.value)
                setSuccess("El email se cambió con éxito")
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
                <Modal.Title>{user?.username}<Button variant="link" onClick={() => { setPage('username') }}>Editar</Button></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={save}>
                    {user && <div style={{ position: 'relative', overflow: 'hidden' }} className='mb-3'>
                        <div style={{ position: 'relative', float: 'left' }} className='mr-3'>
                            {user.hasPicture && <FaWindowClose onClick={removePp} style={{ position: 'absolute', right: '0px', cursor: 'pointer' }} />}
                            <img alt="profile_picture" src={pictureUrl} style={{ borderRadius: '50%' }} className='pp' />
                            <div className='pb'>
                                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                    <div variant="light"><FaCamera className='mr-2 camera' /><span style={{ verticalAlign: 'middle' }}>{user.hasPicture ? 'Cambiar' : 'Agregar'}</span></div>
                                </label>
                            </div>
                            <input type="file" id="file-input" accept="image/png, image/gif, image/jpeg" style={{ display: 'none' }}
                                onChange={event => {
                                    updatePp(event.target.files[0])
                                }} />
                        </div>
                        <div style={{ position: 'relative', float: 'left' }}>
                            <div>
                                <Button variant="link" onClick={() => setPage('password')}>Cambiar Contraseña</Button>
                            </div>
                            <div>
                                <Button variant="link" onClick={() => setPage('email')}>Cambiar Correo</Button>
                            </div>
                        </div>
                    </div>}

                    {!user && <div style={{ position: 'relative', overflow: 'hidden' }} className='mb-3'>
                        <div style={{ position: 'relative', float: 'left' }} className='mr-3'>
                            <img alt="profile_picture" src={pictureUrl} style={{ borderRadius: '50%' }} className='pp' />
                            <div>
                                <div className='pb' variant="light"><span style={{ verticalAlign: 'middle' }}>Agregar</span></div>
                            </div>
                        </div>
                        <div style={{ position: 'relative', float: 'left' }}>
                            <h4>Usuario</h4>
                        </div>
                    </div>}

                    {page &&
                        <>
                            <Input id="curPassword" label='Contraseña Actual' type="password"
                                placeholder="Contraseña que usa para iniciar sesión" {...origPassProps} >
                                <FaLock />
                            </Input>
                            {page === 'username' && <Input id="username" label='Nombre de Usuario' type="text" {...usernameProps} autocomplete="off" >
                                <FaUser />
                            </Input>}
                            {page === 'email' && <Input id="email" label='Email' type="email" autocomplete="off"
                                placeholder='Para recuperar su cuenta si olvida su contraseña' {...emailProps} >
                                <FaEnvelope />
                            </Input>}
                            {page === 'password' && <>
                                <Input id="newPassword" label='Contraseña Nueva' type="password"
                                    placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                                    <FaLock />
                                </Input>
                                <Input id="conf" label='Confirmación de la Contraseña' type="password"
                                    placeholder="Repita la contraseña nueva" {...passConfProps} >
                                    <FaCopy />
                                </Input>
                            </>}
                        </>
                    }
                    {msg && <Alert variant={msg.type} className='mt-3'>{msg.msg}</Alert>}
                    <Button className="float-right" variant="primary" disabled={!page} type="submit">Guardar
                        <FaCheck className='ml-2' />
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}