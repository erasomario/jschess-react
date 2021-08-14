import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { toast } from 'react-toastify'
import { editBoardOpts } from '../../clients/user-client'
import { useRadio } from '../../hooks/useRadio'
import { useAuth } from '../../providers/ProvideAuth'
import { mix } from '../../utils/Colors'


const colors = {
    "green_cream": { primary: "#64B2B4", secondary: "#FAF9F4", dot: "rgba(55, 112, 114, 0.4)", selection: "rgba(33, 150, 243, 0.4)" },
    "brown_cream": { primary: "#B58863", secondary: "#F0D9B5", dot: "rgba(60, 45, 33, 0.3)", },
    "light_blue": { primary: "#ADC5CF", secondary: mix("#ADC5CF", '#FFFFFF', 0.75) },
    "blue_cream": { primary: "#70C1E1", secondary: "#FAF9F4", selection: "rgba(55, 161, 22, 0.4)" },
    "blue_blue": { primary: "#70C1E1", secondary: mix("#70C1E1", '#FFFFFF', 0.7), selection: "rgba(55, 161, 22, 0.4)" },
    "red_blue": { primary: "#E17077", secondary: mix("#E17077", '#FFFFFF', 0.7) },
    "parrot": { primary: "#86A666", secondary: "#FFFFDD", dot: "rgba(55, 112, 114, 0.4)", },
    "dark": { primary: "#ABABAB", secondary: "#DCDCDC" },
}

export { colors }
export function BoardOptionsDialog({ show, onHide, onChange, options }) {

    const { user } = useAuth()
    const [color, setColor] = useState()
    const [sounds, setSounds] = useState()

    const saveCoords = useCallback(coords => {
        if (user) {
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [color, onChange, sounds, user])

    const [getCoordProps, coords, setCoords] = useRadio(null, saveCoords)

    useEffect(() => { 
        setColor(options?.colors)
        setSounds(options?.sounds)
        setCoords(options?.coords)
    }, [options, setCoords])

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

