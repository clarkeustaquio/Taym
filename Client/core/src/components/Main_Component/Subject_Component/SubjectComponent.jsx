import React, { useEffect, useState } from 'react'
import { Container, Button, Table, Modal, Form } from 'react-bootstrap'
import axios from 'axios'
import { domain } from '../../../static/api_request_urls'
function SubjectComponent(){
    const token = localStorage.getItem('token')
    const [subject, setSubject] = useState([])

    useEffect(() => {
        document.title = 'Subject'
    }, [])

    useEffect(() => {
        axios.get(`${domain}api/subject/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data)
            }
        }).catch(() => {
            throw new Error('Server Refused. Try again later.')
        })
    }, [])

    const [subjectName, setSubjectName] = useState('')
    const [subjectID, setSubjectID] = useState(-1)
    const [isRequest, setIsRequest] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    

    const [editShow, setEditShow] = useState(false)
    const handleEditClose = () => setEditShow(false)
    const handleEditShow = (id, subject) => {
        setEditShow(true)   
        setSubjectName(subject)
        setSubjectID(id)
    }  

    const [deleteShow, setDeleteShow] = useState(false)
    const handleDeleteClose = () => setDeleteShow(false)
    const handleDeleteShow = (id, subject) => {
        setDeleteShow(true)
        setSubjectName(subject)
        setSubjectID(id)
    }

    const handleDeleteSubject = () => {
        setIsRequest(true)
        axios.delete(`${domain}api/subject/`, {
            data: {
                subject_name: subjectName,
                subject_id: subjectID,
            },
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data)
                setIsRequest(false)
                setDeleteShow(false)
                setSubjectName('')
            }
        }).catch(() => {
            throw new Error('Server Refused. Try again later.')
        }) 
    }

    const handleEditSubject = () => {
        setIsRequest(true)
        axios.put(`${domain}api/subject/`, {
            subject_name: subjectName,
            subject_id: subjectID
        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data)
                setIsRequest(false)
                setEditShow(false)
                setSubjectName('')
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }

    const handleAddSubject = () => {
        setIsRequest(true)
        axios.post(`${domain}api/subject/`, {
            subject: subjectName
        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data)
                setIsRequest(false)
                setShow(false)
                setSubjectName('')
                
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }

    return (
        <React.Fragment>
            <Container>
                {subject.length === 0 ? null : <h5 className="float-left mt-2 font-weight-bold">Subjects</h5>}
                <Button onClick={handleShow} className="float-right mb-4" variant="outline-success">Add Subject</Button>
                    {subject.length === 0 ?
                    <div className="text-center lead">
                        <span className="font-weight-bold text-center text-muted mt-5">No available subjects.</span>
                    </div>
                    : <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
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
                                                        <Button onClick={() => handleEditShow(item.id, item.subject)} variant="success" block>Edit</Button>
                                                    </div>
                                                    <div className="col">
                                                        <Button onClick={() => handleDeleteShow(item.id, item.subject)} variant="danger" block>Delete</Button>
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
                <Modal.Title>Add Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="ml-1">Subject name</Form.Label>
                        <Form.Control 
                            value={subjectName}
                            onChange={(event) => setSubjectName(event.target.value)}
                            size="lg" type="text" placeholder="Enter subject" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    CANCEL
                </Button>
                <Button disabled={isRequest} variant="success" onClick={handleAddSubject}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={editShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="ml-1">Subject name</Form.Label>
                        <Form.Control 
                            value={subjectName}
                            onChange={(event) => setSubjectName(event.target.value)}
                            size="lg" type="text" placeholder="Enter subject" />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleEditClose}>
                    CANCEL
                </Button>
                <Button disabled={isRequest} variant="success" onClick={handleEditSubject}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={deleteShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <b>{subjectName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={handleDeleteClose}>
                    CANCEL
                </Button>
                <Button disabled={isRequest} variant="danger"onClick={handleDeleteSubject}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default SubjectComponent