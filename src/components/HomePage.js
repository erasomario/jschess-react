import React, { useCallback, useEffect } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import LeftTabs from './LeftTabs';
import { Col, Container, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import { Table } from './Table';
import { useGame } from '../providers/ProvideGame'
import { apiRequest } from '../utils/ApiClient'
import socketIOClient from "socket.io-client";

export default function HomePage() {
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
        const socket = process.env.NODE_ENV === 'development' ? socketIOClient("http://127.0.0.1:4000") : socketIOClient()
        socket.emit('link', { id: user.id });

        socket.on('gameTurnChanged', data => {
            console.log('gameTurnChanged')
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
        <Container fluid>
            <Row>
                <Col xs={3} className='m-0 p-0'><LeftTabs onGameSelected={gameSelected} /></Col>
                <Col xs={6} className='m-0 p-0'><Table /></Col>
            </Row>
        </Container>
    </>
}