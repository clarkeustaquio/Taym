import axios from 'axios';
import React, {useEffect, useState} from 'react'
import { Table, Button, Card, Row, Col, Modal, Form } from 'react-bootstrap'
import { domain } from '../../../static/api_request_urls'

import DailyParentBoardComponent from './DailyParentBoardComponent';

function ParentViewComponent(){
    const token = localStorage.getItem('token')
    const [subject, setSubject] = useState([])
    const [data, setData] = useState([])
    const [background, setBackground] = useState([])
    const [border, setBorder] = useState([])

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
    
    const backgrounds = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]

    const borders = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]
    
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

                setSubject(response.data.serializer)
                setData(response.data.data)
                
                let bg = []
                let br = []

                response.data.serializer.map((item, index) => { 
                    const color_length = backgrounds.length
                    const min = 0;
                    const max = color_length - 1;
                    const rand = min + Math.random() * (max - min); 

                    bg.push(backgrounds[Math.floor(rand)])
                    br.push(borders[Math.floor(rand)])
                })

                setBackground(bg)
                setBorder(br)
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

    const [showRemark, setShowRemark] = useState(false)
    const handleCloseRemark = () => setShowRemark(false)
    const handleOpenRemark = (this_remark) => {
        setShowRemark(true)
        setMyRemark(this_remark)
    }

    const [myRemark, setMyRemark] = useState('')

    return (
        <React.Fragment>
            <DailyParentBoardComponent 
                subject={subject}
                setSubject={setSubject}
                data={data}
                setData={setData}
                background={background}
                setBackground={setBackground}
                border={border}
                setBorder={setBorder}
            />
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
                                            <th>Alt-Tab</th>
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
                                                    <td>{item.change_tab_count}</td>
                                                    {/* <td>{item.task_remark}</td> */}
                                                    <td><Button onClick={() => handleOpenRemark(item.remark)} variant="success" block>View Remark</Button></td>
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

            <Modal show={showRemark} onHide={handleCloseRemark}>
                <Modal.Header closeButton>
                <Modal.Title>Remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Remarks</Form.Label>
                            <Form.Control value={myRemark} as="textarea" rows={5} required contentEditable={false}/>
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={handleCloseRemark}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default ParentViewComponent