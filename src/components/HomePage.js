import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../providers/ProvideAuth';
import LeftTabs from './LeftTabs';
import { Col, Container, Row } from 'react-bootstrap';
import { Table } from './Table';
import { useGame } from '../providers/ProvideGame'
import { apiRequest } from '../utils/ApiClient'
import socketIOClient from "socket.io-client"
import Moves from '../components/Moves'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './blablabla.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Dropdown from 'react-bootstrap/Dropdown'
import EditUserDialog from '../components/users/EditUserDialog'
import { getProfilePictureUrl } from '../controllers/user-controller';

export default function HomePage() {

    const [showDialog, setShowDialog] = useState(false)
    const [pictureUrl, setPictureUrl] = useState()
    const { user, key, signOut } = useAuth()
    const [game, , updateGame] = useGame()

    const gameId = game ? game.id : ""
    const gameSelected = useCallback((id) => {
        apiRequest(`/v1/games/${id}`, 'get', key, null, (error, data) => {
            updateGame(data)
        })
    }, [key, updateGame]);

    useEffect(() => {
        user && getProfilePictureUrl(user).then(setPictureUrl)
    }, [user])

    useEffect(() => {
        if (!user) {
            return
        }

        console.log('Connecting to socket.io')
        console.log(user.id);
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
    }, [gameSelected, user]);

    const logout = (e) => {
        e.preventDefault()
        signOut(() => { })
    }

    if (!user) {
        return <></>
    }

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

        <EditUserDialog show={showDialog} onHide={() => { setShowDialog(false) }}></EditUserDialog>
        <Container fluid>
            <Row>
                <Col xs={3} className='m-0 p-0'><LeftTabs onGameSelected={gameSelected} /></Col>
                <Col xs={6} className='m-0 p-0'><Table /></Col>
                <Col xs={3} className='m-0 p-0'>
                    <DropdownButton as={ButtonGroup} title={user.username} variant="link">
                        <Dropdown.Item onClick={() => setShowDialog(true)}>Editar Perfil</Dropdown.Item>
                        <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
                    </DropdownButton>
                    <img width='50' height='50' src={pictureUrl} style={{ borderRadius: '50%' }} />
                    <Moves />
                </Col>
            </Row>
        </Container>
    </>
}