import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/ApiClient'
import { useAuth } from '../providers/ProvideAuth'
import { Scrollbars } from 'react-custom-scrollbars';
import ListGroup from 'react-bootstrap/ListGroup'
import { useInput } from '../hooks/useInput';
import Form from 'react-bootstrap/Form'

export default function UserList({ onSelect = (a) => a, style }) {

    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)
    const { user } = useAuth()
    const [props] = useInput()

    useEffect(() => {
        if (props.value.length >= 3) {
            apiRequest(`/v1/users?like=${props.value}`, 'GET', user.api_key, null, (error, data) => {
                if (!error) {
                    setList(data.filter((u) => u.id !== user.id))
                } else {
                    console.log(error);
                }
            })
        } else {
            setList([])
        }

    }, [user, props.value])

    return <>

        <Form.Group>
            <Form.Control {...props} placeholder="Escriba parte del nombre" />
        </Form.Group>

        <Scrollbars style={style} className='mb-2'>
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
        </Scrollbars>
    </>
}