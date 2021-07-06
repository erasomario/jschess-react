import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { FaArrowLeft } from "react-icons/fa"
import { FaCamera } from "react-icons/fa"
import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaCopy } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { FaWindowClose } from "react-icons/fa"

import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from '../../providers/ProvideAuth'
import { useEffect } from 'react'

import './EditPage.css'
import {
    editUsername,
    editPassword,
    getProfilePictureUrl,
    removeProfilePicture,
    updateProfilePicture,
    editEmail
} from '../../controllers/user-controller'
import Control from '../Control'

export default function EditPage() {
    const { user, key, refreshKey } = useAuth()
    const [pictureUrl, setPictureUrl] = useState()
    const [usernameProps, usetUsername, usernameFocus] = useInput()
    const [emailProps, , emailFocus] = useInput()
    const [origPassProps, , origPassFocus] = useInput()
    const [passProps, , passFocus] = useInput()
    const [passConfProps, , passConfFocus] = useInput()

    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const [page, setPage] = useState(null)
    useEffect(() => {
        getProfilePictureUrl(user).then(setPictureUrl).catch(setError)
        usetUsername(user?.username)
    }, [user])

    const save = async (e) => {
        e.preventDefault()
        try {
            if (!origPassProps.value) {
                origPassFocus()
                throw 'Debe escribir la contraseña actual'
            }
            if (page === 'username') {
                if (!usernameProps.value) {
                    usernameFocus()
                    throw 'Debe escribir un nuevo nombre de usuario'
                }
                await editUsername(user, origPassProps.value, usernameProps.value)
                setSuccess("El nombre de usuario se cambió con éxito")
            } else if (page === 'password') {
                if (!passProps.value) {
                    passFocus()
                    throw 'Debe escribir una nueva contraseña'
                } else if (!passConfProps.value) {
                    passConfFocus()
                    throw 'Debe escribir la confirmación de la nueva contraseña'
                } else if (passProps.value !== passConfProps.value) {
                    passConfFocus()
                    throw 'La nueva contraseña y su confirmación no coinciden'
                }
                await editPassword(user, origPassProps.value, passProps.value)
                setSuccess("La contraseña se cambió con éxito")
            } else if (page === 'email') {
                if (!emailProps.value) {
                    emailFocus()
                    throw 'Debe escribir un nuevo email'
                }
                await editEmail(user, origPassProps.value, emailProps.value)
                setSuccess("El email se cambió con éxito")
            }
            await refreshKey(user.api_key)
            setError()
        } catch (e) {
            setError(e)
            setSuccess()
        }
    }

    const removePp = () => {
        removeProfilePicture(user)
            .then(() => { refreshKey(key) })
            .catch(e => setError(e))
    }

    const updatePp = (file) => {
        file && updateProfilePicture(user, file)
            .then(() => { refreshKey(key) })
            .catch(e => setError(e))
    }

    return (
        <div style={{
            background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
            height: '100vh'
        }}>
            <div className="container p-3">
                <Card className="mx-auto mt-3">
                    <Card.Body>
                        <Card.Title><Link to="/"><FaArrowLeft className='mr-2' /></Link>
                            Editar Perfil
                        </Card.Title>

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
                                <h4>{user.username}<Button variant="link" onClick={() => setPage('username')}>Editar</Button></h4>
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
                                <Form>
                                    <Control label='Contraseña Actual' type="password"
                                        placeholder="Contraseña que usa para iniciar sesión" {...origPassProps} >
                                        <FaLock />
                                    </Control>
                                    {page === 'username' && <Control label='Nombre de Usuario' type="text" {...usernameProps} ><FaUser />
                                    </Control>
                                    }
                                    {page === 'email' && <Control label='Email' type="email"
                                        placeholder='Para recuperar su cuenta si tiene olvida su contraseña' {...emailProps} >
                                        <FaEnvelope />
                                    </Control>
                                    }
                                    {page === 'password' &&
                                        <>
                                            <Control label='Contraseña Nueva' type="password"
                                                placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                                                <FaLock />
                                            </Control>
                                            <Control label='Confirmación de la Contraseña' type="password"
                                                placeholder="Repita la contraseña" {...passConfProps} >
                                                <FaCopy />
                                            </Control>
                                        </>
                                    }
                                    <Button variant="primary" onClick={save}>Guardar<FaCheck className='ml-2' /></Button>
                                </Form>
                            </>
                        }
                        {error && <Alert variant="danger" className='mt-3'>{error}</Alert>}
                        {success && <Alert variant="success" className='mt-3'>{success}</Alert>}
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}