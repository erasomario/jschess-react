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

export default function RegisterPage() {
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
            addUser(usernameProps.value, emailProps.value, passProps.value, file)
                .then(() => {
                    setPage('created')
                    setError(null)
                }).catch(e => setError(e.message))
        }
    };

    return (
        <div className='p-3 pt-4' style={{
            background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
            height: '100vh'
        }}>

            <Card className="mx-auto dialog">
                <Card.Body>
                    <Card.Title>
                        <Link to={`${process.env.PUBLIC_URL}/login`}><FaArrowLeft className='mr-2' /></Link>
                        <span className='align-middle'>
                            Registrarse
                        </span>
                    </Card.Title>
                    {page === 'create' &&
                        <>
                            <Card.Text>
                                Puede crear una cuenta únicamente con los siguientes datos:
                            </Card.Text>
                            <Form onSubmit={register}>
                                <Input autocomplete="off" id="username" label='Nombre de Usuario' type="text" {...usernameProps} >
                                    <FaUser />
                                </Input>
                                <Input autocomplete="off" id="email" label='Email' type="email"
                                    placeholder='Para recuperar su cuenta si tiene olvida su contraseña' {...emailProps} >
                                    <FaEnvelope />
                                </Input>
                                <Input id="password" label='Contraseña' type="password"
                                    placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                                    <FaLock />
                                </Input>
                                <Input id="conf" label='Confirmación de la Contraseña' type="password"
                                    placeholder="Repita la contraseña" {...passConfProps} >
                                    <FaCopy />
                                </Input>

                                <Form.Group controlId="picture" className="mb-3">
                                    <Form.Label>Imágen de Perfil (Opcional)</Form.Label>
                                    <Form.File
                                        label={file?.name || ''}
                                        data-browse="Seleccionar"
                                        accept="image/png, image/gif, image/jpeg"
                                        custom
                                        onChange={event => {
                                            setFile(event.target.files[0])
                                        }}
                                    />
                                </Form.Group>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Button className='float-right' variant="primary" type="submit">
                                    <span className='align-middle'>Crear Cuenta</span><FaUserPlus className='ml-2' />
                                </Button>
                            </Form>
                        </>
                    }
                    {page === 'created' &&
                        <>
                            <Card.Text>
                                <b>{usernameProps.value}</b> su cuenta se creó con éxito, ahora puede iniciar sesión con los datos que suministró
                            </Card.Text>
                            <Link to={`${process.env.PUBLIC_URL}/login`} ><Button variant="primary">Ir al Inicio de Sesión</Button></Link>
                        </>
                    }
                </Card.Body>
            </Card>
        </div>
    )
}