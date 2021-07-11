import { Alert, Button, Form } from 'react-bootstrap'
import UserList from '../users/UsersList'
import { useEffect, useState } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import { useRadio } from '../../hooks/useRadio'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Modal from 'react-bootstrap/Modal'
import { FaArrowLeft, FaArrowRight, FaChessPawn } from 'react-icons/fa'
//import { createGame } from '../../controllers/game-client'

const times = [5, 10, 15, 30, 60, 0]

export default function CreateGame({ show, onHide = a => a, onNewGame = a => a }) {
    const { user } = useAuth()
    const [error, setError] = useState(null)
    const [player, setPlayer] = useState(null)
    const [makeTimeProps, time, setTime] = useRadio(null)
    const [additionTime, setAdditionTime] = useState(null)
    const [makeColorProps, color, setColor] = useRadio(null)
    const [page, setPage] = useState(null)

    useEffect(() => {
        setError()
        setPlayer()
        setAdditionTime(8)
        setPage('player')
        setColor('wb')
        setTime(5)
    }, [show, setTime, setColor])

    const create = (e) => {
        e.preventDefault()
        if (!player) {
            setError('Seleccione un oponente')
        } else {
            console.log(player)
           /* createGame(user.api_key, player.id, time, additionTime, color)
                .then(onNewGame)
                .catch(e => setError(e.message))*/
        }
    }

    const nextPage = (e) => {
        e.preventDefault()
        if (!player) {
            setError('Seleccione un oponente')
        } else {
            setError()
            setPage("opts")
        }
    }

    const goBack = () => {
        setPlayer()
        setPage('player')
    }

    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <div style={{ overflow: 'hidden' }} >
                {page !== 'player' && <FaArrowLeft className='mr-2 mt-1 text-primary align-middle' style={{ cursor: "pointer", display: "inline" }} onClick={goBack} />}
                <h4 style={{ display: "inline" }} className='align-top'>Nueva Partida</h4>
            </div>
        </Modal.Header>
        <Modal.Body>
            {page === 'player' && <Form onSubmit={nextPage}>
                <Form.Group>
                    <Form.Label>Oponente</Form.Label>
                    <UserList style={{ height: '15rem' }} onSelect={(u) => setPlayer(u)}></UserList>
                </Form.Group>
                {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
                <Button className='float-right' type="submit"><span className='align-baseline'>Continuar</span><FaArrowRight className='ml-2' /></Button>
            </Form>}

            {page === 'opts' && <Form onSubmit={create}>
                <Form.Group>
                    <Form.Label>Minutos por Cada Jugador</Form.Label>
                    <ButtonGroup toggle >
                        {times.map((t, i) => <ToggleButton
                            key={i}
                            name="time"
                            {...makeTimeProps(t)}>
                            {t !== 0 ? t : 'Ilimitado'}
                        </ToggleButton>
                        )}
                    </ButtonGroup>
                </Form.Group>
                <Form.Group controlId="formBasicRange">
                    <Form.Label>Segundos de Adición por Jugada: <b>{additionTime}</b></Form.Label>
                    <Form.Control disabled={time === 0} type="range" custom min="0" max="180" defaultValue={additionTime} onChange={(e) => setAdditionTime(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <ButtonGroup toggle>
                        <ToggleButton  {...makeColorProps('w')} name="color" variant="primary">
                            <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/wk.svg')` }} />
                        </ToggleButton>
                        <ToggleButton {...makeColorProps('wb')} name="color" variant="primary">
                            <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/rand.svg')` }} />
                        </ToggleButton>
                        <ToggleButton {...makeColorProps('b')} name="color" variant="primary">
                            <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('/assets/bk.svg')` }} />
                        </ToggleButton>
                    </ButtonGroup>
                </Form.Group>
                {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
                <Button className='float-right' type="submit"><span className='align-baseline'>Crear Partida</span><FaChessPawn className='ml-2' /></Button>
            </Form>}
        </Modal.Body>
    </Modal>
}