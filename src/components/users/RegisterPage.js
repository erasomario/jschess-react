import { useInput } from '../../hooks/useInput'
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { apiRequest } from '../../utils/ApiClient'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import Control from '../Control';

import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { FaEnvelope } from 'react-icons/fa'
import { FaCopy } from 'react-icons/fa'


export default function RegisterPage() {
  const [file, setFile] = useState(null)
  const [usernameProps, , usernameFocus] = useInput("chiquimarzo");
  const [emailProps, , mailFocus] = useInput("chiquimarzo@gmail.com");
  const [passProps, , passFocus] = useInput("123456");
  const [passConfProps, , passConfFocus] = useInput("123456");

  const [error, setError] = useState();
  const [page, setPage] = useState('create');

  let register = (e) => {
    e.preventDefault();
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
        if (file) {
          return apiRequest(`/v1/users/${usr.id}/picture`, 'PUT', usr.api_key, file)
        } else {
          setPage('created')
          setError(null)
        }
      }).then(() => {
        setPage('created')
        setError(null)
      }).catch(e => setError(e))
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
      height: '100vh'
    }}>
      <div className="container p-3">
        <Card className="mx-auto mt-3">
          <Card.Body>
            <Card.Title><Link to="/login"><FaArrowLeft className='mr-2' /></Link>Registrarse</Card.Title>
            {page === 'create' &&
              <>
                <Card.Text>
                  Puede crear una cuenta únicamente con los siguientes datos:
                </Card.Text>
                <Form>
                  <Control label='Nombre de Usuario' type="text" {...usernameProps} ><FaUser /></Control>
                  <Control label='Email' type="email"
                    placeholder='Para recuperar su cuenta si tiene olvida su contraseña' {...emailProps} >
                    <FaEnvelope />
                  </Control>
                  <Control label='Contraseña' type="password"
                    placeholder="Contraseña que usará para iniciar sesión" {...passProps} >
                    <FaLock />
                  </Control>
                  <Control label='Confirmación de la Contraseña' type="password"
                    placeholder="Repita la contraseña" {...passConfProps} >
                    <FaCopy />
                  </Control>
                  <Form.Group>
                    <Form.File
                      accept="image/png, image/gif, image/jpeg"
                      onChange={event => {
                        setFile(event.target.files[0])
                      }}
                    />
                  </Form.Group>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Button variant="primary" onClick={register}>Crear Cuenta<FaUserPlus className='ml-2' /></Button>
                </Form>
              </>
            }
            {page === 'created' &&
              <>
                <Card.Text>
                  {usernameProps.value} su cuenta se creó con éxito, ahora puede iniciar sesión con los datos que suministró
                </Card.Text>
                <Link to="/login"><Button variant="primary">Ir al Inicio de Sesión</Button></Link>
              </>
            }
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}