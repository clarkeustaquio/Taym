import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import axios from 'axios'


function ParentRequestComponent(){
    const token = localStorage.getItem('token')

    const [isRequest, setIsRequest] = useState(false)
    const [isAccept, setIsAccept] = useState(false)
    const [parentName, setParentName] = useState('')

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const domain = 'http://localhost:8000/'
    const remote = 'https://taym.herokuapp.com/'

    const handleAccept = () => {
        axios.post(`${domain}api/accept-parent/`, {

        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setIsAccept(response.data.is_approve_student)
                setParentName(response.data.parent)
                setShow(false)
            }
        })
    }

    const handleDecline = () => {
        axios.post(`${domain}api/decline-parent/`, {

        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setIsAccept(response.data.is_approve_student)
                setParentName(response.data.parent)
                setDeclineShow(false)
            }
        })
    }

    const [declineShow, setDeclineShow] = useState(false)
    const handleDeclineClose = () => setDeclineShow(false)
    const handleDeclineShow = () => setDeclineShow(true)

    useEffect(() => {
        document.title = 'Parent'
    }, [])

    useEffect(() => {
        axios.get(`${domain}api/parent-check/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setIsRequest(response.data.is_request)
                setIsAccept(response.data.is_approve_student)
                setParentName(response.data.parent)
            }
        })
    }, [])

    return (
        <React.Fragment>
            {isAccept === false ?
            <div>
                {isRequest === false ? <div className="align-middle">
                    <div className="container h-100">
                        <div className="row align-items-center h-100">
                            <div className="col-6 mx-auto">
                                <div className="jumbotron text-center">
                                    <h3>No parent request.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : <div>
                    <div className="container h-100">
                        <div className="row align-items-center h-100">
                            <div className="col-6 mx-auto">
                                <div className="jumbotron text-center">
                                    <h3>Parent request from <b>{parentName}</b>!</h3>
                                    <Button onClick={handleShow} className="mt-4" variant='success' block>Accept</Button>
                                    <Button onClick={handleDeclineShow} className="mt-2" variant='danger' block>Decline</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                }
            </div>
            :
            <div>
                <div>
                    <div className="container h-100">
                        <div className="row align-items-center h-100">
                            <div className="col-6 mx-auto">
                                <div className="jumbotron text-center">
                                    <h3>Your Parent: <b>{parentName}</b>!</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
        
            

            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Accept Parent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to accept parent request?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    No
                </Button>
                <Button variant="success" onClick={handleAccept}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={declineShow} onHide={handleDeclineClose}>
                <Modal.Header closeButton>
                <Modal.Title>Decline Parent</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to decline parent request?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleDeclineClose}>
                    No
                </Button>
                <Button variant="success" onClick={handleDecline}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default ParentRequestComponent