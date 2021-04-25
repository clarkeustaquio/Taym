import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Modal} from 'react-bootstrap'
import axios from 'axios'

import DashBoardComponent from './DashBoardComponent'

function HistoryComponent(){
    const token = localStorage.getItem('token')

    const [isMount, setIsMount] = useState(false )

    const [weekHistory, setWeekHistory] = useState([])
    const [allHistory, setAllHistory] = useState([])
    const [subjectID, setSubjectID] = useState(-1)
    const [workName, setWorkName] = useState('')

    const [subject, setSubject] = useState([])
    const [calendar, setCalendar] = useState([])

    const [monthName, setMonthName] = useState('')

    const domain = 'http://localhost:8000/'
    const remote = 'https://taym.herokuapp.com/'

    useEffect(() => {
        axios.get(`${domain}api/history/`, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setWeekHistory(response.data.week_history)
                setAllHistory(response.data.all_history)
                setSubject(response.data.subjects)
                setCalendar(response.data.monthly_calendar)
                setMonthName(response.data.month_name)
                setIsMount(true)
            }
        })
    }, [])

    const handleMonth = (month) => {
        axios.post(`${domain}api/history/`, {
            month: month
        }, {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setWeekHistory(response.data.week_history)
                setAllHistory(response.data.all_history)
                setSubject(response.data.subjects)
                setCalendar(response.data.monthly_calendar)
                setMonthName(response.data.month_name)
                setIsMount(true)
            }
        })
    }

    const handleDeleteTask = () => {
        axios.delete(`${domain}api/delete-task/`, {
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
            {isMount === false ? null :
            <Container>
                <DashBoardComponent subject={subject} calendar={calendar} handleMonth={handleMonth} monthName={monthName} />

                {weekHistory.length === 0 ?
                <div className="text-center lead">
                    <span className="font-weight-bold text-center text-muted mt-5">No available task history.</span>
                </div>
                : <div>
                    <div className="mt-1">
                        <span className="h6 font-weight-bold text-muted">This week</span>
                        <hr></hr>
                    </div>
                    <div style={{
                        overflowX: 'scroll',
                        whiteSpace: 'nowrap'
                    }}>
                    <Table striped bordered hover
                    >
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Time Spent</th>
                                <th>Task Remarks</th>
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
                                        <td>{item.task_remark}</td>
                                        <td>
                                            <Button onClick={() => handleDeleteShow(item.id, item.task)} block variant="danger" block>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    </div>
                    
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
                                <th>Task Remark</th>
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
                                        <td>{item.task_remark}</td>
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

            }
            
            <Modal centered show={deleteShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <b>{workName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="success"onClick={handleDeleteClose}>
                    CANCEL
                </Button>
                <Button variant="danger" onClick={handleDeleteTask}>
                    OK
                </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}

export default HistoryComponent