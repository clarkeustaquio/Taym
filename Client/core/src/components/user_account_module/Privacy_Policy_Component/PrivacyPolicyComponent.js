import React from 'react'
import { Modal, Button } from 'react-bootstrap'

import ViewComponent from './ViewComponent'

import './Modal.css'

function PrivacyPolicyComponent({ modalShow, setModalShow }) {

    const is_login = localStorage.getItem('token')

    return (
        <React.Fragment>
            <Modal
                show={modalShow}
                onHide={setModalShow}
                size="lg"
                scrollable="true"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        KMLNGMLKS Corp. Privacy Policy
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ViewComponent />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={is_login !== null ? "primary" : "success" } onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default PrivacyPolicyComponent