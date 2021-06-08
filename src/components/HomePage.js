import React from 'react'
import { useAuth } from '../providers/ProvideAuth';
import Button from 'react-bootstrap/Button';

export default function HomePage() {
    const [user, , signout] = useAuth()

    const logout = () => {
        signout(() => {})
    }

    return <>
        <h3>Bienvenido {user.username}</h3>
        <Button onClick={logout}>Salir</Button>
    </>
}