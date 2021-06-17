import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/ApiClient'
import { useAuth } from '../providers/ProvideAuth'
import ListGroup from 'react-bootstrap/ListGroup'

export default function UserList({ onSelect = (a) => a }) {

    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)
    const [user] = useAuth()

    useEffect(() => {
        apiRequest('/v1/users?like=a', 'GET', user.api_key, null, (error, data) => {
            if (!error) {
                setList(data.filter((u) => u.id !== user.id))
            } else {
                console.log(error);
            }
        })
    }, [user]);

    if (list.length === 0) {
        return <p>Cargando...</p>
    }

    return <ListGroup className="overflow-auto" style={{height: '100px'}}>
        {list && list.map((u) => <ListGroup.Item
            key={u.id}
            active={selected && selected.id === u.id}
            onClick={() => { setSelected(u); onSelect(u) }}
            style={{ cursor: 'pointer' }}
        >{u.username}</ListGroup.Item>)}
    </ListGroup >
}