import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Modal} from 'react-bootstrap'
import axios from 'axios'

function HistoryComponent(){
    const token = localStorage.getItem('token')

    const [weekHistory, setWeekHistory] = useState([])
    const [allHistory, setAllHistory] = useState([])
    const [subjectID, setSubjectID] = useState(-1)
    const [workName, setWorkName] = useState('')

    useEffect(() => {
        axios.get('https://taym.herokuapp.com/api/history/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setWeekHistory(response.data.week_history)
                setAllHistory(response.data.all_history)
            }
        })
    }, [])

    const handleDeleteTask = () => {
        axios.delete('https://taym.herokuapp.com/api/delete-task/', {
            data: {
                task_id: subjectID
            },
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setWeekHistory(response.data.week_history)
                setAllHistory(response.data.all_history)
                setDeleteShow(false)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }

    const [deleteShow, setDeleteShow] = useState(false)
    const handleDeleteClose = () => setDeleteShow(false)
    const handleDeleteShow = (id, subject) => {
        setDeleteShow(true)
        setWorkName(subject)
        setSubjectID(id)
    }

    useEffect(() => {
        document.title = 'History'
    }, [])
    return (
        <React.Fragment>
            <Container>
                {weekHistory.length === 0 ?
                <div className="text-center lead">
                    <span className="font-weight-bold text-center text-muted mt-5">No available task history.</span>
                </div>
                : <div>
                    <div className="mt-1">
                        <span className="h6 font-weight-bold text-muted">This week</span>
                        <hr></hr>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Time Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weekHistory.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.task}</td>
                                        <td>{item.start_date}</td>
                                        <td>{item.end_date}</td>
                                        <td>{item.time_spent}</td>
                                        <td>
                                            <Button onClick={() => handleDeleteShow(item.id, item.task)} block variant="danger" block>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
                }
                        
                {allHistory.length === 0 ? null :
                <div>
                    <div className="mt-5">
                        <span className="h6 font-weight-bold text-muted">All History</span>
                        <hr></hr>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Time Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allHistory.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.task}</td>
                                        <td>{item.start_date}</td>
                                        <td>{item.end_date}</td>
                                        <td>{item.time_spent}</td>
                                        <td>
                                            <Button onClick={() => handleDeleteShow(item.id, item.task)} block variant="danger" block>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>
                }
            </Container>
            <Modal centered show={deleteShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <b>{workName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="success"onClick={handleDeleteClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteTask}>
                    Delete Task
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default HistoryComponent