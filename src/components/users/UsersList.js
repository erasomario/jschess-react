import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import { findUsersLike } from '../../clients/user-client';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { useTranslation } from 'react-i18next';

export default function UserList({ onSelect = (a) => a, style, focus }) {

    const textRef = useRef()
    const [text, setText] = useState("")
    const { user, apiKey } = useAuth()
    const [list, setList] = useState([])
    const [selected, setSelected] = useState(null)
    const { t } = useTranslation()

    const [error, setError] = useState();

    useEffect(() => {
        textRef.current && textRef.current.focus()
    }, [])

    useEffect(() => {
        if (text.length >= 3) {
            findUsersLike(text, apiKey)
                .then(data => { setList(data.filter((u) => u.id !== user.id)); setError() })
                .catch(e => setError(e.message))
        } else {
            setError()
            setList([])
        }
    }, [user, apiKey, text])

    return <>
        <Form.Group>
            <Form.Control
                onKeyDown={e => e.key === " " ? e.preventDefault() : null}
                onChange={e => setText(e.target.value.replace(/\s/g, ""))}
                value={text}
                ref={textRef}
                placeholder={t("white part of the name")} />
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
                    {t("type at least three letters to search")}
                </div>
            </div>}
        {(!error && list.length === 0 && text.length >= 3) &&
            <div style={{ ...style, display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <div>
                    {t("there are no players like")} "{text}"
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