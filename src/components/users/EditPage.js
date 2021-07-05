import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import { apiRequest } from '../../utils/ApiClient'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaCopy } from 'react-icons/fa'
import { FaWindowClose } from "react-icons/fa";

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useAuth } from '../../providers/ProvideAuth'
import { useEffect } from 'react';

import './EditPage.css'
import { getProfilePictureUrl, removeProfilePicture, updateProfilePicture } from '../../controllers/user-controller';
import Control from '../Control';

export default function EditPage() {
    const [pictureUrl, setPictureUrl] = useState()
    const { user, key, refreshKey } = useAuth()
    const [usernameProps, , usernameFocus] = useInput("chiquimarzo")
    const [emailProps, , mailFocus] = useInput("chiquimarzo@gmail.com")
    const [passProps, , passFocus] = useInput("123456")
    const [passConfProps, , passConfFocus] = useInput("123456")

    const [error, setError] = useState()
    const [page, setPage] = useState(null)
    useEffect(() => {
        getProfilePictureUrl(user).then(setPictureUrl).catch(setError)
    }, [user])

    const register = (e) => {
        if (!usernameProps.value) {
            usernameFocus()
            setError('Debe escribir un nombre de usuario')
        } else if (!emailProps.value) {
            mailFocus()
            setError('Debe escribir un correo')
        } else if (!passProps.value) {
            passFocus()
            setError('Debe escribir una contraseña')
        } else if (!passConfProps.value) {
            passConfFocus()
            setError('Debe escribir una confirmación de contraseña')
        } else if (passProps.value !== passConfProps.value) {
            passConfFocus()
            setError('La contraseña y su confirmación no coinciden')
        } else {
            apiRequest(`/v1/users/`, 'POST', null, { username: usernameProps.value, email: emailProps.value, password: passProps.value }
            ).then(usr => {

            }).then(() => {
                setPage('created')
                setError(null)
            }).catch(e => setError(e))
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
                                <div>
                                    <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                        <div className='pb' variant="light"><FaCamera className='mr-2' /><span style={{ verticalAlign: 'middle' }}>{user.hasPicture ? 'Cambiar' : 'Agregar'}</span></div>
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
                                    <div className='pb' variant="light"><FaCamera className='mr-2' /><span style={{ verticalAlign: 'middle' }}>Agregar</span></div>
                                </div>
                            </div>
                            <div style={{ position: 'relative', float: 'left' }}>
                                <h4>Usuario</h4>
                            </div>
                        </div>}

                        {page &&
                            <>
                                <Form>
                                    <Control label='Contraseña' type="password"
                                        placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                                        <FaLock />
                                    </Control>
                                    {page === 'username' &&
                                        <>
                                            <Control label='Nombre de Usuario' type="text" {...usernameProps} ><FaUser /></Control>
                                        </>
                                    }

                                    {page === 'email' &&
                                        <>
                                            <Control label='Email' type="email"
                                                placeholder='Para recuperar su cuenta si tiene olvida su contraseña' {...emailProps} >
                                                <FaEnvelope />
                                            </Control>
                                        </>
                                    }

                                    {page === 'password' &&
                                        <>
                                            <Control label='Contraseña' type="password"
                                                placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                                                <FaLock />
                                            </Control>
                                            <Control label='Confirmación de la Contraseña' type="password"
                                                placeholder="Repita la contraseña" {...passConfProps} >
                                                <FaCopy />
                                            </Control>
                                        </>
                                    }
                                    <Button variant="primary" onClick={register}>Guardar<FaUserPlus className='ml-2' /></Button>
                                </Form>
                            </>
                        }
                        {error && <Alert variant="danger">{error}</Alert>}
                    </Card.Body>
                </Card>
            </div>
        </div >
    )
}