import { useInput } from '../../hooks/useInput'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import { generateRecoveryKey, recoverPassword } from '../../controllers/user-controller'
import { FaUser, FaLock, FaCopy, FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import Input from '../Input'

export default function RecoverPage() {

  const [loginProps] = useInput("")
  const [keyProps, , keyFocus] = useInput("")
  const [passProps, , passFocus] = useInput("")
  const [passConfProps, , passConfFocus] = useInput("")

  const [error, setError] = useState();
  const [recoveryData, setRecoveryData] = useState(null);
  const [page, setPage] = useState('login');

  useEffect(() => {
    setError()
  }, [page])

  const generateKey = (e) => {
    e.preventDefault();
    generateRecoveryKey(loginProps.value)
      .then(data => {
        setRecoveryData(data)
        setPage('key')
      }).catch(e => setError(e.message))
  }

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
      setError('Debe escribir la confirmación de nueva contraseña')
    } else if (passProps.value !== passConfProps.value) {
      passConfFocus()
      setError('La contraseña y su confirmación no coinciden')
    } else {
      recoverPassword(recoveryData.id, keyProps.value, passProps.value)
        .then(() => setPage('end'))
        .catch(e => setError(e.message))
    }
  }

  return (
    <div className='p-3 pt-4' style={{
      background: 'linear-gradient(0deg, #eef2f3 0%, #8e9eab 100%)',
      height: '100vh'
    }}>

      <Card className="mx-auto dialog">
        <Card.Body>
          <Card.Title>
            {(page === 'login' || page === 'end') && <Link to="/login"><FaArrowLeft className='mr-2' /></Link>}
            {page === 'key' && <FaArrowLeft className='mr-2 text-primary' style={{ cursor: "pointer" }} onClick={() => setPage('login')} />}
            <span className='align-middle'>
              Recuperar Contraseña
            </span>
          </Card.Title>

          {page === 'login' &&
            <>
              <Card.Text>
                Si olvidó sus datos de acceso, escriba el correo o el nombre de usuario que usó para registrarse y recibirá instrucciones para recuperar su cuenta.
              </Card.Text>
              <Form onSubmit={generateKey}>
                <Input id='login' label='Nombre de Usuario o Email' {...loginProps} type="text" autocomplete="off">
                  <FaUser />
                </Input>
                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" className="float-right">
                  <span className='align-middle'>
                    Continuar
                  </span>
                  <FaArrowRight className='ml-2' />
                </Button>
              </Form>
            </>
          }
          {page === 'key' &&
            <>
              <Card.Text>
                A su correo {recoveryData.mail} se envió su nombre de usuario y una clave de {recoveryData.keyLenght} caracteres.
              </Card.Text>
              <Form onSubmit={sendKey}>
                <Input autocomplete='off' id='key' label='Clave' {...keyProps} type='text' placeholder={`Clave de ${recoveryData.keyLenght} caracteres que llegó a su correo`} >
                  <FaLock />
                </Input>

                <Input id='pass' label='Nueva Contraseña' {...passProps} type='password' placeholder='Nueva contraseña que usará para iniciar sesión' >
                  <FaLock />
                </Input>

                <Input id='conf' label='Confirmación de la Nueva Contraseña' {...passProps} type='password' placeholder='Repita la nueva contraseña' >
                  <FaCopy />
                </Input>

                {error && <Alert variant="danger">{error}</Alert>}
                <Button variant="primary" type="submit" className="float-right">
                  <span className='align-middle'>
                    Continuar
                  </span>
                  <FaArrowRight className='ml-2' />
                </Button>
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
    </div>
  )
}