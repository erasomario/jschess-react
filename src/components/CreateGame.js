import { Alert, Button, Form } from 'react-bootstrap'
import UserList from './UsersList'
import { useState } from 'react'
import { apiRequest } from '../utils/ApiClient'
import { useAuth } from '../providers/ProvideAuth'
import { useRadio } from '../hooks/useRadio'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

const times = [5, 10, 15, 30, 60, 0]

export default function CreateGame({ onNewGame = (a) => a }) {
    const [user] = useAuth()
    const [error, setError] = useState(null)
    const [player, setPlayer] = useState(null)
    const [getTimeProps, time] = useRadio(5)
    const [additionTime, setAddedTime] = useState(8)
    const [getColorProps, color] = useRadio('wb')

    const create = () => {
        if (!player) {
            setError('Seleccione un jugador')
        } else {
            apiRequest('/v1/games', 'post', user.api_key, { userId: player.id, color, time, additionTime }, (error, data) => {
                if (error) {
                    setError(error)
                } else {
                    onNewGame(data)
                }
            })
        }
    }

    return <div className='m-3'>
        <Form>
            <Form.Group>
                <Form.Label>Oponente</Form.Label>
                <UserList style={{ height: '20vh' }} onSelect={(u) => setPlayer(u)}></UserList>
            </Form.Group>
            <Form.Group>
                <Form.Label>Minutos por Cada Jugador</Form.Label>
                <ButtonGroup toggle >
                    {times.map((t, i) => <ToggleButton
                        key={i}
                        name="time"
                        {...getTimeProps(t)}>
                        {t !== 0 ? t : 'Ilimitado'}
                    </ToggleButton>
                    )}
                </ButtonGroup>
            </Form.Group>
            <Form.Group controlId="formBasicRange">
                <Form.Label>Segundos de Adición por Jugada: <b>{additionTime}</b></Form.Label>
                <Form.Control disabled={time === 0} type="range" min="0" max="180" defaultValue={additionTime} onChange={(e) => setAddedTime(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <ButtonGroup toggle>
                    <ToggleButton  {...getColorProps('w')} name="color" variant="outline-primary">
                        <div style={{ width: `35px`, height: `35px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/wk.svg')` }} />
                    </ToggleButton>
                    <ToggleButton {...getColorProps('wb')} name="color" variant="outline-primary">
                        <div style={{ width: `35px`, height: `35px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/rand.svg')` }} />
                    </ToggleButton>
                    <ToggleButton {...getColorProps('b')} name="color" variant="outline-primary">
                        <div style={{ width: `35px`, height: `35px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/bk.svg')` }} />
                    </ToggleButton>
                </ButtonGroup>
            </Form.Group>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button block onClick={create}>Crear Juego</Button>
    </div>
}