import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import LeftTabs from './LeftTabs';
import { Col, Container, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Table } from './Table';
import { useGame } from '../providers/ProvideGame'
import { apiRequest } from '../utils/ApiClient'
import socketIOClient from "socket.io-client"
import Moves from '../components/Moves'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './blablabla.css'


export default function HomePage() {

    const [data, setData] = useState()
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
            toast(data.msg)
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

    useEffect(() => {
        apiRequest(`/v1/users/${user.id}/picture`, 'GET', user.api_key, null)
            .then(r => r.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(setData)
    }, [user.api_key, user.id])

    return <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />

        <img src={data} />


        <Container fluid>
            <Row>
                <Col xs={3} className='m-0 p-0'><LeftTabs onGameSelected={gameSelected} /></Col>
                <Col xs={6} className='m-0 p-0'><Table /></Col>
                <Col xs={3} className='m-0 p-0'>
                    <NavDropdown title={user.username} id="basic-nav-dropdown" alignRight>
                        <NavDropdown.Item onClick={logout}>Salir</NavDropdown.Item>
                    </NavDropdown>
                    <Moves />
                </Col>
            </Row>
        </Container>
    </>
}