import React, { useCallback, useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'
import { FaCheck, FaCog } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { editBoardOpts } from '../../clients/user-client'
import { useRadio } from '../../hooks/useRadio'
import { useAuth } from '../../providers/ProvideAuth'
import { mix } from '../../utils/Colors'


const colors = {
    "blue": { primary: "#84ADEA", secondary: "#CBDCF7", dot: "rgba(55, 112, 114, 0.4)", selection: "rgba(150, 243, 33, 0.4)" },
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
    const { t } = useTranslation()
    const { user, apiKey } = useAuth()
    const [color, setColor] = useState()
    const [sounds, setSounds] = useState()

    const saveCoords = useCallback(coords => {
        if (user) {
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts, apiKey).then(e => toast.error(e.message))
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
            editBoardOpts(user, opts, apiKey).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [coords, onChange, sounds, user])

    const saveSound = useCallback(sounds => {
        if (user) {
            setSounds(sounds)
            const opts = { coords: coords, colors: color, sounds }
            editBoardOpts(user, opts, apiKey).then(e => toast.error(e.message))
            onChange(opts)
        }
    }, [color, coords, onChange, user])

    const circleSize = 3.5;

    return <Modal style={{ userSelect: "none" }} show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <FaCog style={{ marginRight: "0.3em" }} />
                <div>{t("board settings")}</div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Check
                    checked={sounds}
                    onChange={e => saveSound(e.target.checked)}
                    type="switch"
                    id="custom-switch"
                    label={t("sounds when moving pieces")}
                />
                <div style={{ marginBottom: "0.75em", marginTop: "0.75em" }}><b>{t("coordinates")}</b></div>

                <Form.Check style={{ marginBottom: "0.3em" }} {...getCoordProps("out_opaque")} custom label={t("opaque border")} />
                <Form.Check style={{ marginBottom: "0.3em" }} {...getCoordProps("out_trans")} custom label={t("transparent border")} />
                <Form.Check style={{ marginBottom: "0.3em" }} {...getCoordProps("in")} custom label={t("internal")} />
                <Form.Check style={{ marginBottom: "0.3em" }} {...getCoordProps("none")} custom label={t("hidden")} />

                <Form.Group style={{ marginTop: "1em" }}>
                    <b>{t("colors")}</b>
                    <Container>
                        <Row>
                            {Object.keys(colors).map(k => {
                                return <Col key={k} style={{ textAlign: "right" }}>
                                    <div
                                        onClick={() => saveColor(k)}
                                        style={{
                                            position: "relative",
                                            backgroundColor: colors[k].primary,
                                            cursor: "pointer",
                                            display: "flex",
                                            width: `${circleSize + 0.2}em`,
                                            height: `${circleSize + 0.2}em`,
                                            margin: "0.5em",
                                            border: "0.1em solid " + colors[k].primary,
                                            boxShadow: "0px 0px 0 0.2em " + (color === k ? "#A3C7F6" : "rgba(0, 0, 0, 0)"),
                                            borderRadius: "50%"
                                        }}>
                                        <div style={{ position: "relative", borderTopLeftRadius: `${circleSize / 2}em ${circleSize / 2}em`, borderBottomLeftRadius: `${circleSize / 2}em ${circleSize / 2}em`, width: `${circleSize / 2}em`, height: `${circleSize}em`, backgroundColor: colors[k].secondary }}></div>
                                        {color === k && <div style={{ right: "0", width: "1.2em", height: "1.2em", backgroundColor: "#1A73E8", borderRadius: "50%", color: "white", position: "absolute" }}>
                                            <FaCheck style={{ top: "0.3em", left: "0.3em", position: "absolute", fontSize: "0.75em" }}></FaCheck>
                                        </div>}
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

