import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { findUsersLike } from '../../clients/user-client';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export default function UserList({ onSelect = (a) => a, style, focus }) {

    const textRef = useRef()
    const [text, setText] = useState("")
    const { user } = useAuth()
    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)

    const [error, setError] = useState();

    useEffect(() => {
        textRef.current && textRef.current.focus()
    }, [])

    useEffect(() => {
        if (text.length >= 3) {
            findUsersLike(text, user.api_key)
                .then(data => { setList(data.filter((u) => u.id !== user.id)); setError() })
                .catch(e => setError(e.message))
        } else {
            setError()
            setList([])
        }
    }, [user, text])

    return <>
        <Form.Group>
            <Form.Control
                onKeyDown={e => e.key === " " ? e.preventDefault() : null}
                onChange={e => setText(e.target.value.replace(/\s/g, ""))}
                value={text}
                ref={textRef}
                placeholder="Escriba parte del nombre" />
        </Form.Group>

        {list.length > 0 &&
            <SimpleBar style={style}>
                <ListGroup>
                    {list && list.map((u) => <ListGroup.Item
                        key={u.id}
                        active={selected && selected.id === u.id}
                        onClick={() => { setSelected(u); onSelect(u) }}
                        style={{ cursor: 'pointer' }}
                    >{u.username}</ListGroup.Item>)}
                </ListGroup >
            </SimpleBar>
        }
        {(list.length === 0 && text.length < 3) &&

            <div style={{ ...style, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <div>
                    Escriba al menos 3 letras para empezar a buscar
                </div>
            </div>}
        {(!error && list.length === 0 && text.length >= 3) &&
            <div style={{ ...style, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <div>
                    No se encontraron jugadores similares a "{text}"
                </div>
            </div>}
        {error &&
            <div style={{ ...style, display: "flex", justifyContent: "flex-start", alignItems: "center", color: "red" }}>
                <div>
                    {error}
                </div>
            </div>}
    </>
}