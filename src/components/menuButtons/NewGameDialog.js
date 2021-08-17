import { Alert, Button, Form } from 'react-bootstrap'
import UserList from '../users/UsersList'
import { useEffect, useState } from 'react'
import { useAuth } from '../../providers/ProvideAuth'
import { useRadio } from '../../hooks/useRadio'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import Modal from 'react-bootstrap/Modal'
import { FaArrowLeft, FaArrowRight, FaChessPawn, FaPlus } from 'react-icons/fa'
import { createGame } from '../../clients/game-client'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useTranslation } from 'react-i18next'

const times = [5, 10, 15, 30, 60, 0]

export default function NewGameDialog({ show, onHide = a => a, onNewGame = a => a }) {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [error, setError] = useState(null)
    const [player, setPlayer] = useState(null)
    const [makeTimeProps, time, setTime] = useRadio(null)
    const [additionTime, setAdditionTime] = useState(null)
    const [makeColorProps, color, setColor] = useRadio(null)
    const [page, setPage] = useState(null)
    const [tab, setTab] = useState("friend");

    useEffect(() => {
        if (show) {
            setError()
            setPlayer()
            setTab("friend")
            setAdditionTime(8)
            setPage('player')
            setColor('wb')
            setTime(5)
        }
    }, [show, setTime, setColor])

    const create = (e) => {
        e.preventDefault()
        if (tab === "friend" && !player) {
            setError(t('choose an opponent'))
        } else {
            createGame(user.api_key, player?.id, time, additionTime, color)
                .then(onNewGame)
                .then(onHide)
                .catch(e => setError(e.message))
        }
    }

    const nextPage = (e) => {
        e.preventDefault()
        if (tab === "friend" && !player) {
            setError(t('choose an opponent'))
        } else {
            setError()
            setPage("opts")
        }
    }

    const goBack = () => {
        setPlayer()
        setPage('player')
    }

    return <Modal show={show} onHide={() => onHide()}>
        <Modal.Header closeButton>
            <Modal.Title style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {page === 'player' && <FaPlus style={{ marginRight: "0.3em" }} />}
                {page !== 'player' && <FaArrowLeft style={{ marginRight: "0.3em", cursor: "pointer", display: "inline" }} onClick={goBack} />}
                <div>{t('new game')}</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>

            {page === 'player' && <Form onSubmit={nextPage}>
                <div style={{ marginBottom: "0.5em" }}>{t('choose an opponent')}</div>
                <Form.Group>
                    <Tabs className="mb-3" activeKey={tab} onSelect={t => { setTab(t); setError() }}>
                        <Tab eventKey="friend" title={t("friends")}>
                            <UserList focus={show} style={{ height: '15rem' }} onSelect={(u) => { setPlayer(u); setError() }}>
                            </UserList>
                        </Tab>
                        <Tab eventKey="pc" title="Robot">
                            <div style={{ height: '10rem', display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <div style={{ flexShrink: "0", borderRadius: '15%', backgroundImage: `url(${process.env.PUBLIC_URL}/assets/bot.svg)`, width: "7em", height: "7em", backgroundSize: "7em 7em", marginRight: "1em" }}></div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <b>{t("hello human")}</b>
                                    <div>{t("bot greeting")}</div>
                                </div>
                            </div>
                            <div style={{ height: "3em" }}></div>
                        </Tab>
                    </Tabs>
                </Form.Group>
                {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit"><span>{t('continue')}</span><FaArrowRight className='ml-2' /></Button>
                </div>
            </Form>
            }

            {
                page === 'opts' && <Form onSubmit={create}>
                    <Form.Group>
                        <Form.Label>{t("minutes for each player")}</Form.Label><br />
                        <ButtonGroup toggle >
                            {times.map((time, i) => <ToggleButton
                                key={i}
                                name="time"
                                {...makeTimeProps(time)}>
                                {time !== 0 ? time : t("unlimited")}
                            </ToggleButton>
                            )}
                        </ButtonGroup>
                    </Form.Group>
                    <Form.Group controlId="formBasicRange">
                        <Form.Label>{t("addition for each move")}: <b>{additionTime}</b></Form.Label>
                        <Form.Control disabled={time === 0} type="range" custom min="0" max="180" defaultValue={additionTime} onChange={(e) => setAdditionTime(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <ButtonGroup toggle>
                            <ToggleButton  {...makeColorProps("w")} name="color" variant="primary">
                                <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('${process.env.PUBLIC_URL}/assets/wk.svg')` }} />
                            </ToggleButton>
                            <ToggleButton {...makeColorProps("wb")} name="color" variant="primary">
                                <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('${process.env.PUBLIC_URL}/assets/rand.svg')` }} />
                            </ToggleButton>
                            <ToggleButton {...makeColorProps("b")} name="color" variant="primary">
                                <div style={{ width: `30px`, height: `30px`, backgroundPosition: 'center', backgroundRepeat: "no-repeat", backgroundSize: `35px 35px`, backgroundImage: `url('${process.env.PUBLIC_URL}/assets/bk.svg')` }} />
                            </ToggleButton>
                        </ButtonGroup>
                    </Form.Group>
                    {error && <Alert className='mt-3' variant="danger">{error}</Alert>}
                    <Button className='float-right' type="submit"><span className='align-baseline'>{t("create game")}</span><FaChessPawn className='ml-2' /></Button>
                </Form>
            }
        </Modal.Body >
    </Modal >
}