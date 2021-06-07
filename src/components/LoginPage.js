import { useAuth } from '../providers/ProvideAuth'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useInput } from '../hooks/useInput'
import { useCheckbox } from '../hooks/useCheckbox'
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

export default function LoginPage() {
  const [error, setError] = useState();
  let history = useHistory();
  let [, signIn] = useAuth();
  let location = useLocation();

  let [loginProps, , loginFocus] = useInput("alderick84");
  let [passProps, , passFocus] = useInput("123456");
  let [remembersProps] = useCheckbox(true);

  let { from } = location.state || { from: { pathname: "/" } };

  
  let login = () => {
    auth.signin(() => {
      history.replace(from);
    });
  };


  let login = (e) => {
    e.preventDefault();

    if (!loginProps.value) {
      loginFocus()
      setError('Debe escribir un email o nombre de usuario')
    } else if (!passProps.value) {
      passFocus()
      setError('Debe escribir una contraseña')
    } else {
      signIn(loginProps.value, passProps.value, remembersProps.checked, (error, usr) => {
        if (usr) {
          history.replace(from);
        } else {
          setError(error);
        }
      });
    }
  };

  return (
    <>
      <Card style={{ width: '36rem' }} className="mx-auto">
        <Card.Body>
          <Card.Title>Iniciar Sesión</Card.Title>
          <Card.Text>Debe indicar su nombre de usuario y contraseña, ni aún no tiene una cuenta <Link to="/recover">puede crearla aquí</Link>
          </Card.Text>
          <Form>
            <Form.Group controlId="login">
              <Form.Label>Nombre de Usuario o Email</Form.Label>
              <Form.Control type="text" {...loginProps} placeholder='' />
            </Form.Group>
            <Form.Group controlId="pass">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" {...passProps} placeholder='' />
            </Form.Group>
            <Form.Group controlId="remember">
              <Form.Check type="checkbox" {...remembersProps} label="Recordarme en este equipo" />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <p><Link to="/recover">Olvidé mi usuario o contraseña</Link></p>
            <Button variant="primary" onClick={login}>Continuar</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}