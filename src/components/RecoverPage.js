import { useInput } from '../hooks/useInput'
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { apiRequest } from '../utils/ApiClient'
import { Link } from 'react-router-dom'

export default function RecoverPage() {

  const [loginProps] = useInput("alderick84");
  const [keyProps, , keyFocus] = useInput("");
  const [passProps, , passFocus] = useInput("123456");
  const [passConfProps, , passConfFocus] = useInput("123456");

  const [error, setError] = useState();
  const [recoveryData, setRecoveryData] = useState(null);
  const [page, setPage] = useState('login');

  let startRecover = (e) => {
    e.preventDefault();
    apiRequest('/v1/recovery_keys/', 'POST', { login: loginProps.value }, (error, data) => {
      if (error) {
        setError(error);
      } else {
        setRecoveryData(data);
        setPage('key')
      }
    })
  };

  let sendKey = (e) => {
    e.preventDefault();
    if (!keyProps.value) {
      keyFocus()
      setError('Debe escribir una clave')
    } else if (!passProps.value) {
      passFocus()
      setError('Debe escribir una nueva contraseña')
    } else if (!passConfProps.value) {
      passConfFocus()
      setError('Debe escribir una confirmación de nueva contraseña')
    } else if (passProps.value !== passConfProps.value) {
      passConfFocus()
      setError('La contraseña y su confirmación no coinciden')
    } else {
      apiRequest(`/v1/users/${recoveryData.id}/recovered_password`, 'PUT', { recoveryKey: keyProps.value, password: passProps.value }, (error, data) => {
        if (error) {
          setError(error);
        } else {
          setPage('end')
        }
      })
    }
  };

  return (
    <>
      <Card style={{ width: '36rem' }} className="mx-auto">
        <Card.Body>
          <Card.Title>Recuperar Contraseña</Card.Title>
          {page === 'login' &&
            <>
              <Card.Text>
                Si olvidó su nombre de usuario o contraseña, escriba el correo o el nombre de usuario que usó para registrarse y recibirá instrucciones para recuperar su cuenta.
              </Card.Text>
              <Form>
                <Form.Group controlId="login">
                  <Form.Label>Nombre de Usuario o Email</Form.Label>
                  <Form.Control {...loginProps} type="text" />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" onClick={startRecover}>Recuperar</Button>
              </Form>
            </>
          }
          {page === 'key' &&
            <>
              <Card.Text>
                A su correo {recoveryData.mail} se envió su nombre de usuario y una clave de {recoveryData.keyLenght} caracteres.
              </Card.Text>
              <Form>
                <Form.Group controlId="key">
                  <Form.Label>Clave</Form.Label>
                  <Form.Control {...keyProps} type="text" placeholder={`Clave de ${recoveryData.keyLenght} caracteres que llegó a su correo`} />
                </Form.Group>
                <Form.Group controlId="pass">
                  <Form.Label>Nueva Contraseña</Form.Label>
                  <Form.Control type="password" {...passProps} placeholder='Nueva contraseña que usará para iniciar sesión' />
                </Form.Group>
                <Form.Group controlId="passConf">
                  <Form.Label>Confirmación de la Nueva Contraseña</Form.Label>
                  <Form.Control type="password" {...passConfProps} placeholder='Repita la nueva contraseña' />
                </Form.Group>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" onClick={sendKey}>Continuar</Button>
              </Form>
            </>
          }
          {page === 'end' &&
            <>
              <Card.Text>
                Su contraseña se cambió con éxito, ahora puede usarla para iniciar sesión
              </Card.Text>
              <Link to="/login"><Button variant="primary">Volver al Inicio de Sesión</Button></Link>
            </>
          }
        </Card.Body>
      </Card>
    </>
  );
}