import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Table, Button, Card, Row, Col, Modal } from 'react-bootstrap'

function ParentViewComponent(){
    const token = localStorage.getItem('token')

    const [childData, setChildData] = useState([])
    const [studentName, setStudentName] = useState([])
    const [subjectName, setSubjectName] = useState('')
    const [subjectID, setSubjectID] = useState(-1)
    
    const [isMount, setIsMount] = useState(false)
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (id, subject) => {
        setShow(true)
        setSubjectName(subject)
        setSubjectID(id)
    };

    const [disapproveShow, setDisapproveShow] = useState(false)
    const handleDisapproveClose = () => setDisapproveShow(false)
    const handleDisapproveShow = (id, subject) => {
        setDisapproveShow(true)
        setSubjectName(subject)
        setSubjectID(id)
    }

    const domain = 'http://localhost:8000/'
    const remote = 'https://taym.herokuapp.com/'
    
    const handleApprove = () => {
        axios.post(`${domain}api/approve-task/`, {
            subject_id: subjectID
        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setChildData(response.data.serializers)
                setShow(false)
                setIsMount(true)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }

    const handleDisapprove = () => {
        axios.post(`${domain}api/disapprove-task/`, {
            subject_id: subjectID
        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setChildData(response.data.serializers)
                setDisapproveShow(false)
                setIsMount(true)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }


    useEffect(() => {
        axios.get(`${domain}api/child-task/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setChildData(response.data.serializers)
                setStudentName(response.data.student_name)
                setIsMount(true)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }, [])

    return (
        <React.Fragment>
            {isMount === false ? null :
            <div>
                {childData.map((child, index) => {
                    const student = studentName[index]
                    return (
                        <div key={index}>
                            {child.length === 0 ?
                             <div className="text-center lead">
                                <span className="font-weight-bold text-center text-muted mt-5">No available task to approve.</span>
                            </div>
                            :<div>
                                <div className="mt-1 mb-n2">
                                    <span className="h6 font-weight-bold text-muted">{student}</span>
                                </div>
                                <hr />
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                            <th>Time Spent</th>
                                            <th>Task Remark</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {child.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.task}</td>
                                                    <td>{item.start_date}</td>
                                                    <td>{item.end_date}</td>
                                                    <td>{item.time_spent}</td>
                                                    <td>{item.task_remark}</td>
                                                    <td>
                                                        <div className="row">
                                                            <div className="col">
                                                                <Button onClick={() => handleDisapproveShow(item.id, item.task)} variant="danger" block>Disapprove</Button>
                                                            </div>
                                                            <div className="col">
                                                                <Button onClick={() => handleShow(item.id, item.task)} variant="success" block>Approve</Button>
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
                        </div>
                    )
                })}
            </div>
            }
            
           <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Approve Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   Are you sure you want to approve <b>{subjectName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    CANCEL
                </Button>
                <Button variant="success" onClick={handleApprove}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={disapproveShow} onHide={handleDisapproveClose}>
                <Modal.Header closeButton>
                <Modal.Title>Disapprove Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                   Are you sure you want to disapprove <b>{subjectName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleDisapproveClose}>
                    CANCEL
                </Button>
                <Button variant="success" onClick={handleDisapprove}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default ParentViewComponent