import { useAuth } from '../../providers/ProvideAuth'
import { useHistory, useLocation, Link } from 'react-router-dom'
import { useInput } from '../../hooks/useInput'
import { useCheckbox } from '../../hooks/useCheckbox'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { FaDoorOpen, FaChessKnight, FaUser, FaLock } from "react-icons/fa"
import Input from '../Input'
import './dialogs.css'

export default function LoginPage() {
  const [error, setError] = useState();
  const history = useHistory();
  const { user, signIn } = useAuth();
  const location = useLocation();

  const [loginProps, , loginFocus] = useInput("");
  const [passProps, , passFocus] = useInput("");
  const [remembersProps] = useCheckbox(true);

  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (user) {
      history.replace(from);
    }
  }, [user, from, history])

  useEffect(() => {
    loginFocus()
  }, [loginFocus])

  const login = (e) => {
    e.preventDefault()
    if (!loginProps.value) {
      loginFocus()
      setError('Debe escribir un email o nombre de usuario')
    } else if (!passProps.value) {
      passFocus()
      setError('Debe escribir una contraseña')
    } else {
      signIn(loginProps.value, passProps.value, remembersProps.checked)
        .then(() => history.replace(from))
        .catch(error => setError(error.message));
    }
  }
  return (
    <div className='p-3 pt-4' style={{
      background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
      height: '100vh'
    }}>

      <Card className="mx-auto dialog">
        <Card.Body>
          <Card.Title><FaChessKnight className='mr-2 text-primary' /><span style={{ verticalAlign: 'middle' }}>Iniciar Sesión</span></Card.Title>
          <Card.Text>Si aún no tiene una cuenta <Link to={`${process.env.PUBLIC_URL}/register`}>puede crearla aquí</Link>, es gratis y no toma más de un minuto.
          </Card.Text>
          <Form onSubmit={login}>
            <Input id="login" label='Nombre de Usuario o Email' {...loginProps} type="text" ><FaUser /></Input>
            <Input id="password" label='Contraseña' {...passProps} type="password" ><FaLock /></Input>
            <Form.Group controlId="remember" style={{ userSelect: 'none' }}>
              <Form.Check type="checkbox" {...remembersProps} custom label="Recordarme en este equipo" />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <p><Link to={`${process.env.PUBLIC_URL}/recover`}>Olvidé mi usuario o contraseña</Link></p>
            <Button className='float-right' variant="primary" type="submit">
              <span className='align-middle'>
                Continuar</span>
              <FaDoorOpen className='ml-2' /></Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}