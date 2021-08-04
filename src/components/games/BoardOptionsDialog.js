import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import { editBoardOpts } from '../../clients/user-client'
import { useRadio } from '../../hooks/useRadio'
import { useAuth } from '../../providers/ProvideAuth'
import { mix } from '../../utils/Colors'

const colors = {
    "green_cream": { primary: "#64B2B4", secondary: "#FAF9F4" },
    "brown_cream": { primary: "#B58863", secondary: "#F0D9B5" },
    "light_blue": { primary: "#ADC5CF", secondary: mix("#ADC5CF", '#FFFFFF', 0.75) },
    "blue_cream": { primary: "#70C1E1", secondary: "#FAF9F4" },
    "blue_blue": { primary: "#70C1E1", secondary: mix("#70C1E1", '#FFFFFF', 0.7) },
    "red_blue": { primary: "#E17077", secondary: mix("#E17077", '#FFFFFF', 0.7) },
    "parrot": { primary: "#86A666", secondary: "#FFFFDD" },
    "dark": { primary: "#ABABAB", secondary: "#DCDCDC" },
}

export { colors }
export function BoardOptionsDialog({ show, onHide, onChange, options }) {

    const { user } = useAuth()
    const [color, setColor] = useState(options?.colors)
    const [sounds, setSounds] = useState(options?.sounds)

    const saveCoords = useCallback(coords => {
        if (user) {
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [color, onChange, sounds, user])

    const [getCoordProps, coords] = useRadio(options?.coords, saveCoords)

    const saveColor = useCallback(color => {
        if (user) {
            setColor(color)
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [coords, onChange, sounds, user])

    const saveSound = useCallback(sounds => {
        if (user) {
            setSounds(sounds)
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [color, coords, onChange, user])

    return <Modal style={{ userSelect: "none" }} show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Opciones del Tablero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Check
                    checked={sounds}
                    onChange={e => saveSound(e.target.checked)}
                    type="switch"
                    id="custom-switch"
                    label="Sonidos al mover las piezas"
                />
                <b>Coordenadas</b>
                <Form.Check {...getCoordProps("out_opaque")} custom label="Borde Opaco" />
                <Form.Check {...getCoordProps("out_trans")} custom label="Borde Transparente" />
                <Form.Check {...getCoordProps("in")} custom label="Internas" />
                <Form.Check {...getCoordProps("none")} custom label="Ocultas" />

                <Form.Group style={{ marginTop: "1em" }}>
                    <b>Colores</b>
                    <Container>
                        <Row>
                            {Object.keys(colors).map(k => {
                                return <Col key={k} style={{ textAlign: "right" }}>
                                    <div
                                        onClick={() => saveColor(k)}
                                        style={{ cursor: "pointer", display: "flex", width: "4em", margin: "0.5em", boxShadow: color === k ? "0 0 0 0.2em rgba(0, 123, 255, 0.75)" : "0px 0px 3px #78909C" }}>
                                        <div style={{ width: "2em", height: "2em", backgroundColor: colors[k].primary }}></div>
                                        <div style={{ width: "2em", height: "2em", backgroundColor: colors[k].secondary }}></div>
                                    </div>
                                </Col>
                            }
                            )}
                        </Row>
                    </Container>
                </Form.Group>
            </Form>
        </Modal.Body>
    </Modal >
}

