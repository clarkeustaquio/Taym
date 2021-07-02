import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Container, Button, Table, Modal, Form, Row, Col } from 'react-bootstrap'
import { domain } from '../../../static/api_request_urls'

function ManageSubjectComponent(){
    const token = localStorage.getItem('token')
    const [subject, setSubject] = useState([])
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        document.title = 'Subject'
    }, [])

    useEffect(() => {
        axios.get(`${domain}api/get-student-subject/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.status === 200){
                setSubject(response.data)
            }
        }).catch(() => {
            throw new Error('Server Refused. Try again later.')
        })

        return () => {
            setSubject([])
        }
    }, [])

    const [subjectID, setSubjectID] = useState(-1)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id) => {
        setShow(true)
        setSubjectID(id)
    }
    const [isRequest, setIsRequest] = useState(false)

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)

    const handleEditDuration = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }else{
            event.preventDefault();
            event.stopPropagation();
            setIsRequest(true)

            axios.post(`${domain}api/edit-duration/`, {
                subject_id: subjectID,
                hour: hour,
                minute: minute,
                second: second
            }, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            }).then(response => {
                if(response.statusText === 'OK'){
                    setIsRequest(false)
                    setSubject(response.data)
                    setShow(false)
                    setValidated(false)
                }
            }).catch((error) => {
                throw new Error('Server Refused. Try again later.')
            })
        }

        setValidated(true);
    }
    
    return (
        <React.Fragment>
           <Container>
                {subject.length === 0 ? null : <h5 className="float-left mt-2 font-weight-bold">Subjects</h5>}
                {subject.length === 0 ?
                <div className="text-center lead">
                    <span className="font-weight-bold text-center text-muted mt-5">No available subjects.</span>
                </div>
                : <div>
                    <Table 
                        striped
                        bordered 
                        hover 
                        style={{
                            overflowY: 'scroll !important',
                            overflowX: 'scroll !important',
                            whiteSpace: 'nowrap',
                        }}>
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Duration</th>
                                <th>Edit Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subject.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.subject}</td>
                                        <td>{item.task_limit}</td>
                                        <td>
                                            <div className="row">
                                                <div className="col">
                                                    <Button onClick={() => handleShow(item.id)} variant="success" block>Edit Duration</Button>
                                                </div>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
                }
            </Container>
            
            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Duration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleEditDuration}>
                        <Form.Group>
                            <Row>
                                <Col>
                                    <Form.Label className="float-left">Hour/s</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="Hour/s" 
                                        min="0" 
                                        max="59"
                                        onChange={(event) => setHour(event.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="float-left">Minute/s</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="Minute/s" 
                                        min="0"
                                        max="59"
                                        onChange={(event) => setMinute(event.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="float-left">Second/s</Form.Label>
                                    <Form.Control
                                        type="number" 
                                        placeholder="Second/s" 
                                        min="0"
                                        max="59"
                                        onChange={(event) => setSecond(event.target.value)}
                                        required
                                     />
                                </Col>
                            </Row>
                        </Form.Group>
                        <div className="mt-4">
                            <Button className="ml-3 float-right" type="submit" disabled={isRequest} variant="success">
                                OK
                            </Button>
                            <Button className="float-right" variant="danger" onClick={handleClose}>
                                CANCEL
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default ManageSubjectComponent