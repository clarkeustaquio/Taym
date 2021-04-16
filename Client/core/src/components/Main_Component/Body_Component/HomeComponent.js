import React, {useState, useEffect} from 'react'
import TimerIcon from '@material-ui/icons/Timer';
import { Table, Modal, Jumbotron, Button, Container, Card, Form, Row, Col} from 'react-bootstrap'

import ParentViewComponent from './ParentViewComponent'
import DashBoardComponent from './DashBoardComponent'

import axios from 'axios'
import moment from 'moment'
import { TrendingUpOutlined } from '@material-ui/icons';

function HomeComponent(){
    const token = localStorage.getItem('token')

    const [validated, setValidated] = useState(false);

    const [workName, setWorkName] = useState('')

    const [second, setSecond] = useState(0)
    const [minute, setMinute] = useState(0)
    const [hour, setHour] = useState(0)

    const [isWorking, setIsWorking] = useState(false)
    const [buttonValue, setButtonValue] = useState('Start')

    const [todayHistory, setTodayHistory] = useState([])
    const [weekHistory, setWeekHistory] = useState([])
    const [allHistory, setAllHistory] = useState([])

    const [isParent, setIsParent] = useState(false)
    const [childData, setChildData] = useState([])
    const [studentName, setStudentName] = useState([])

    const [isMount, setIsMount] = useState(false)

    const [subject, setSubject] = useState([])
    const [subjectID, setSubjectID] = useState(-1)

    useEffect(() => {
        document.title = 'Home'
    })

    useEffect(() => {
        axios.get('https://taym.herokuapp.com/api/subject/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setSubject(response.data)
                if(response.data.length > 0){
                    setWorkName(response.data[0].subject)
                    setSubjectID(response.data[0].id)
                }
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }, [])

    useEffect(() => {
        axios.get('https://taym.herokuapp.com/api/get-time/',{
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText == 'OK'){
                const current_time = moment()
                const is_working = response.data.is_working

                if(is_working){
                    const start_time = moment(response.data.start_time)
                    const hours = current_time.diff(start_time, 'hours')
                    const minutes = current_time.diff(start_time, 'minutes') % 60
                    const seconds = current_time.diff(start_time, 'seconds') % 60 
                    
                    setIsWorking(is_working)
                    setHour(hours)
                    setMinute(minutes)
                    setSecond(seconds)
                    setWorkName(response.data.current_task)
                }
                
                if(response.data.is_parent){
                    // setChildData(response.data.serializers)
                    // setStudentName(response.data.student_name)
                    setIsParent(true)                    
                }
                setIsMount(true)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    }, [])

    useEffect(() => {
        axios.get('https://taym.herokuapp.com/api/get-task/', {
            headers: {
                'Authorization': 'Token ' + token
            }
        }).then(response => {
            if(response.statusText === 'OK'){
                setTodayHistory(response.data.today_history)
                setWeekHistory(response.data.week_history)
                setAllHistory(response.data.all_history)
            }
        }).catch((error) => {
            throw new Error('Server Refused. Try again later.')
        })
    },[])

    useEffect(() => {
        if(isWorking){
            const interval = setInterval(() => {
                if(second >= 0 && second < 60){
                    setSecond(second + 1)
                }
    
                if(second === 59){
                    setMinute(minute + 1)
                    setSecond(0)
                }
    
                if(minute === 59 && second == 59){
                    setHour(hour + 1)
                    setMinute(0)
                }
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    })

    const handleStart = (event) => {
        // const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if(workName.length === 0){
            setValidated(true)
        }else{
            axios.post('https://taym.herokuapp.com/api/task-manager/', {
                start_date: moment(),
                task_name: workName,
                subject_id: subjectID,
            }, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            }).then(response => {
                if(response.statusText === 'OK'){
                    setValidated(false)
                    setIsWorking(true)
                    setButtonValue('Stop')
                    setShow(false)
                }
            }).catch((error) => {
                throw new Error('Server Refused. Try again later.')
            })
        }
    }

    const handleStop = () => {

        if(workName.length > 0){
            axios.post('https://taym.herokuapp.com/api/stop-task/',
            {
                task_name: workName
            }, {
                headers: {
                    'Authorization': 'Token ' + token
                }
            }).then(response => {
                if(response.statusText === 'OK'){
                    
                    setTodayHistory(response.data.today_history)
                    setWeekHistory(response.data.week_history)
                    setWorkName('')
            
                    setSecond(0)
                    setMinute(0)
                    setHour(0)
                    
                    setIsWorking(false)
                    setValidated(false)
                    setWorkName(response.data.subjects[0].subject)
                    setEndShow(false)
                }
            }).catch((error) => {
                throw new Error('Server Refused. Try again later.')
            })
        }else{
            setValidated(true)
        }
    }

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
                setTodayHistory(response.data.today_history)
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

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
    }

    const [endShow, setEndShow] = useState(false)
    const handleEndClose = () => setEndShow(false)
    const handleEndShow = () => {
        setEndShow(true)   
        // setSubjectName(subject)
        // setSubjectID(id)
    }  

    // <div>
    //             {childData.map((child, index) => {
    //                 const student = studentName[index]
    //                 return (
    //                     <ParentViewComponent key={index} />
    //                 )
    //             })}
    //         </div> 
    return (
        <React.Fragment>
            {isMount === false ? null :
            <div>
            {isParent === true ? <ParentViewComponent /> :
                <div>
                    <DashBoardComponent />

                    <Card className="mt-5">
                        <Card.Body>
                        <Form noValidate validated={validated}>
                            <Row className="mb-n3">
                                <Col xl={7}>
                                <Form.Group>
                                    <Form.Control 
                                            disabled={isWorking === true ? true : false}
                                            value={workName}
                                            onChange={(event) => {
                                                const index = event.target.selectedIndex;
                                                const el = event.target.childNodes[index]
                                                const option = el.getAttribute('id'); 

                                                setWorkName(event.target.value)
                                                setSubjectID(option)
                                            }}
                                            as="select"
                                        >
                                        {subject.map((item, index) => {
                                            return (
                                                <option id={item.id} key={index}>{item.subject}</option>
                                            )
                                        })}
                                    </Form.Control>
                                </Form.Group>     
                                </Col>
                                <Col>
                                    <Row>
                                        <Col>
                                            <h4 className="font-weight-bold mt-1 ml-3">
                                                <span>
                                                <TimerIcon className="mt-n1 mr-1"/>
                                                {hour < 10 ? <span> 0{hour} </span> : <span> {hour}</span>}  : 
                                                {minute < 10 ? <span> 0{minute} </span> : <span> {minute}</span>}  :
                                                {second < 10 ? <span> 0{second} </span> : <span> {second}</span>} 
                                                
                                                </span>
                                            </h4>
                                        </Col>
                                        <Col>
                                            {isWorking === false 
                                            ? <Button disabled={subject.length > 0 ? false : true} value="Start" onClick={handleShow} variant="success" block>Start</Button>
                                            : <Button value="Stop" onClick={(event) => handleEndShow()} variant="danger" block>Stop</Button>
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    

                    {weekHistory.length === 0 ? <div className="text-center mt-5 lead">
                        <span className="font-weight-bold text-center text-muted mt-5">No available task history.</span>
                    </div> : <div className="mb-5">
                        <div className="mt-5">
                            <span className="h6 font-weight-bold text-muted">Today</span>
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
                                {todayHistory.map((item, index) => {
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
                </div>
            }
            </div>
            }

            <Modal centered show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Start Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                     Are you sure you want to start <b>{workName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    No
                </Button>
                <Button variant="success" onClick={handleStart}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal centered show={endShow} onHide={handleEndClose}>
                <Modal.Header closeButton>
                <Modal.Title>End Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                     Are you sure you want to end <b>{workName}</b>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleEndClose}>
                    No
                </Button>
                <Button variant="success" onClick={handleStop}>
                    Yes
                </Button>
                </Modal.Footer>
            </Modal>

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

export default HomeComponent