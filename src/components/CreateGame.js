import { Alert, Button, Form } from 'react-bootstrap'
import UserList from './UsersList'
import { useState } from 'react'
import { apiRequest } from '../utils/ApiClient'
import { useAuth } from '../providers/ProvideAuth'

export default function CreateGame({ onNewGame = (a) => a }) {

    const [error, setError] = useState(null)
    const [player, setPlayer] = useState(null)
    const [user] = useAuth()

    const create = () => {
        if (!player) {
            setError('Seleccione un jugador')
        } else {
            apiRequest('/v1/games', 'post', user.api_key, { userId: player.id }, (error, data) => {
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
                <Form.Label>Jugador</Form.Label>
                <UserList onSelect={(u) => setPlayer(u)}></UserList>
            </Form.Group>
        </Form>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button onClick={create}>Crear Juego</Button>
    </div>
}