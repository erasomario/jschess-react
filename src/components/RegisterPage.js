import { useInput } from '../hooks/useInput'
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { apiRequest } from '../utils/ApiClient'
import { Link } from 'react-router-dom'

export default function RecoverPage() {

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
      apiRequest(`/v1/users/`, 'POST', { username: usernameProps.value, email: emailProps.value, password: passProps.value }, (error, data) => {
        if (error) {
          setError(error);
        } else {
          setPage('created')
        }
      })
    }
  };

  return (
    <>
      <Card style={{ width: '36rem' }} className="mx-auto">
        <Card.Body>
          <Card.Title>Registrarse</Card.Title>
          {page === 'create' &&
            <>
              <Card.Text>
                Puede crear una cuenta únicamente con los siguientes datos:
              </Card.Text>
              <Form>
                <Form.Group>
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control type="text" {...usernameProps} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...emailProps} placeholder={`Para recuperar su cuenta si tiene olvida su contraseña`} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control type="password" {...passProps} placeholder='Contraseña que usará para iniciar sesión' />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirmación de la Contraseña</Form.Label>
                  <Form.Control type="password" {...passConfProps} placeholder='Repita la contraseña' />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" onClick={register}>Crear Cuenta</Button>
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
    </>
  );
}