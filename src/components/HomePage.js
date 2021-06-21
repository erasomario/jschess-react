import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import LeftTabs from './LeftTabs';
import { Col, Container, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Toast from 'react-bootstrap/Toast'

import { Table } from './Table';
import { useGame } from '../providers/ProvideGame'
import { apiRequest } from '../utils/ApiClient'
import socketIOClient from "socket.io-client";

export default function HomePage() {

    const [toasts, setToasts] = useState([])
    const [user, , signout] = useAuth()
    const [game, , updateGame] = useGame()

    const gameId = game ? game.id : ""
    const gameSelected = useCallback((id) => {
        apiRequest(`/v1/games/${id}`, 'get', user.api_key, null, (error, data) => {
            updateGame(data)
        })
    }, [user.api_key, updateGame]);

    useEffect(() => {
        console.log('Connecting to socket.io')
        const opts = { query: { id: user.id } }
        const socket = process.env.NODE_ENV === 'development' ? socketIOClient("http://127.0.0.1:4000", opts) : socketIOClient(opts)
        socket.on('gameTurnChanged', data => {
            console.log('gameTurnChanged')
            setToasts((t) => [...t, { id: new Date().getMilliseconds(), msg: data.msg }])
            gameSelected(data.id)
        })

        return () => {
            console.log('disconnecting from socket.io')
            socket.disconnect()
        }
        //
    }, [gameSelected, user.id, gameId]);

    const logout = (e) => {
        e.preventDefault()
        signout(() => { })
    }

    const removeToast = (id) => {
        setToasts(ts => ts.filter(t => t.id !== id))
    }

    return <>
        <Navbar bg="light" expand="lg">
            <Navbar.Brand>JSChess</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end mr-auto">
                <NavDropdown title={user.username} id="basic-nav-dropdown" alignRight>
                    <NavDropdown.Item onClick={logout}>Salir</NavDropdown.Item>
                </NavDropdown>
            </Navbar.Collapse>
        </Navbar>

        <div style={{ position: "absolute", zIndex: 1000, right: '0px' }}>
            {toasts.map(m =>
                <Toast key={m.id} delay={6000} autohide onClose={() => removeToast(m.id)}>
                    <Toast.Header>
                        <strong className="mr-auto">Atención</strong>
                    </Toast.Header>
                    <Toast.Body>{m.msg}</Toast.Body>
                </Toast>
            )}
        </div>

        <Container fluid>
            <Row>
                <Col xs={3} className='m-0 p-0'><LeftTabs onGameSelected={gameSelected} /></Col>
                <Col xs={6} className='m-0 p-0'><Table /></Col>
            </Row>
        </Container>
    </>
}