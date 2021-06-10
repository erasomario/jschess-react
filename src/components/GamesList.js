import { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

export default function GamesList({ onSelect = (a) => a, games, selected: extSelected }) {

    const [selected, setSelected] = useState(extSelected)
    useEffect(() => { setSelected(extSelected) }, [extSelected])

    if (!games) {
        return <p>Cargando...</p>
    }

    if (games.length === 0) {
        return <p>No hay partidas en curso</p>
    }

    return <ListGroup>
        {games && games.map((g) =>
            <ListGroup.Item
                className='m-0 p-2'
                key={g.id}
                active={!selected ? false : selected === g.id}
                onClick={() => { setSelected(g.id); onSelect(g.id) }}
                style={{ cursor: 'pointer' }}>
                <div style={{ fontWeight: 'bold' }}>{g.playerName}</div>
                <p className='m-0 p-0'>{g.turn}</p>
            </ListGroup.Item>)}
    </ListGroup >
}