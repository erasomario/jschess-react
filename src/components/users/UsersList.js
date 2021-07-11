import { useState, useEffect } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import ListGroup from 'react-bootstrap/ListGroup'
import { useInput } from '../../hooks/useInput';
import Form from 'react-bootstrap/Form'
import { findUsersLike } from '../../controllers/user-client';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

export default function UserList({ onSelect = (a) => a, style }) {

    const { user } = useAuth()
    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)

    const [props] = useInput()
    const [error, setError] = useState();

    useEffect(() => {
        if (props.value.length >= 3) {
            findUsersLike(props.value, user.api_key)
                .then(data => { setList(data.filter((u) => u.id !== user.id)); setError() })
                .catch(e => setError(e.message))
        } else {
            setError()
            setList([])
        }
    }, [user, props.value])

    return <>
        <Form.Group>
            <Form.Control {...props} placeholder="Escriba parte del nombre" />
        </Form.Group>

        <SimpleBar style={style}>
            {list.length > 0 && <ListGroup>
                {list && list.map((u) => <ListGroup.Item
                    key={u.id}
                    active={selected && selected.id === u.id}
                    onClick={() => { setSelected(u); onSelect(u) }}
                    style={{ cursor: 'pointer' }}
                >{u.username}</ListGroup.Item>)}
            </ListGroup >
            }
            {(list.length === 0 && props.value.length < 3) && <div style={{ height: '100%', display: 'table-cell', verticalAlign: 'middle' }}>
                <div>
                    Escriba al menos 3 letras para empezar a buscar
                </div>
            </div>}
            {(list.length === 0 && props.value.length >= 3) && <div style={{ height: '100%', display: 'table-cell', verticalAlign: 'middle' }}>
                <div>
                    No se encontraron jugadores similares a "{props.value}"
                </div>
            </div>}
            {error && <div style={{ height: '100%', display: 'table-cell', verticalAlign: 'middle' }}>
                <div>
                    {error}
                </div>
            </div>}
        </SimpleBar>
    </>
}