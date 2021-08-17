import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { Button } from 'react-bootstrap'

export function makeYesNoDialog(title, message, yesLabel, noLabel, yesCb, noCb) {
    return { title, message, yesLabel, noLabel, yesCb, noCb }
}

export function YesNoDialog({ dialog }) {
    const [show, setShow] = useState(false)
    useEffect(() => {
        if (dialog) {
            setShow(true)
        }
    }, [dialog])

    return <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>{dialog?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{dialog?.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1em" }}>
                <Button variant="secondary" onClick={() => { setShow(false); if (dialog?.noCb) { dialog.noCb() } }} className="mr-2">
                    <span>{dialog?.noLabel}</span><FaTimes className='ml-2' />
                </Button>
                <Button onClick={() => { setShow(false); if (dialog?.yesCb) { console.log("callling cb");dialog.yesCb() } }}>
                    <span>{dialog?.yesLabel}</span><FaCheck className='ml-2' />
                </Button>
            </div>
        </Modal.Body>
    </Modal >
}

