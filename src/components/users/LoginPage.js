import { useAuth } from '../../providers/ProvideAuth'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useInput } from '../../hooks/useInput'
import { useCheckbox } from '../../hooks/useCheckbox'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { FaDoorOpen } from "react-icons/fa";
import { FaChessKnight } from "react-icons/fa";
import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'

import Control from '../Control'

export default function LoginPage() {
  const [error, setError] = useState();
  const history = useHistory();
  const [user, signIn] = useAuth();
  const location = useLocation();

  const [loginProps, , loginFocus] = useInput("alderick84");
  const [passProps, , passFocus] = useInput("123456");
  const [remembersProps] = useCheckbox(true);

  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (user) {
      history.replace(from);
    }
  }, [user, from, history])

  const login = (e) => {
    if (!loginProps.value) {
      loginFocus()
      setError('Debe escribir un email o nombre de usuario')
    } else if (!passProps.value) {
      passFocus()
      setError('Debe escribir una contraseña')
    } else {
      signIn(loginProps.value, passProps.value, remembersProps.checked)
        .then(() => history.replace(from))
        .catch(error => setError(error));
    }
  }
  return (
    <div style={{
      background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
      height: '100vh'
    }}>
      <div className="container p-3">
        <Card className="mx-auto mt-3">
          <Card.Body>
            <Card.Title><FaChessKnight className='mr-2' />Iniciar Sesión</Card.Title>
            <Card.Text>Si aún no tiene una cuenta <Link to="/register">puede crearla aquí</Link>, es gratis y no toma más de un minuto.
            </Card.Text>
            <Form>
              <Control label='Nombre de Usuario o Email' {...loginProps} type="text" ><FaUser /></Control>
              <Control label='Contraseña' {...passProps} type="password" ><FaLock /></Control>
              <Form.Group controlId="remember" style={{ userSelect: 'none' }}>
                <Form.Check type="checkbox" {...remembersProps} custom label="Recordarme en este equipo" />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <p><Link to="/recover">Olvidé mi usuario o contraseña</Link></p>
              <Button variant="primary" onClick={() => login()}>Continuar<FaDoorOpen className='ml-2' /></Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}