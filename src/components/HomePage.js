import React, { useCallback, useState } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import Button from 'react-bootstrap/Button';
import LeftTabs from './LeftTabs';
import { Col, Container, Row } from 'react-bootstrap';
import { Board } from './Board';
import { apiRequest } from '../utils/ApiClient'

export default function HomePage() {
    const [user, , signout] = useAuth()
    const [game, setGame] = useState();

    const gameSelected = useCallback((id) => {
        apiRequest(`/v1/games/${id}`, 'get', user.api_key, null, (error, data) => { 
            setGame(data)
        })
    }, [user.api_key]);

    const logout = () => {
        signout(() => { })
    }

    return <>
        <h3>Bienvenido {user.username}</h3>
        <Button onClick={logout}>Salir</Button>
        <Container fluid>
            <Row>
                <Col className='m-0 p-0'><LeftTabs onGameSelected={gameSelected} ></LeftTabs></Col>
                <Col className='m-0 p-0'><Board game={game}></Board></Col>
            </Row>
        </Container>



    </>
}