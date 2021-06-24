import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Modal, Popover, OverlayTrigger, Form } from 'react-bootstrap'
import axios from 'axios'

import DashBoardComponent from './DashBoardComponent'
import { DateRangePicker } from 'react-date-range';
import DateRangeIcon from '@material-ui/icons/DateRange';
import Moment from 'moment'
import { domain } from '../../../static/api_request_urls'

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

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dateChange, setDateChange] = useState(false)
    const [submit, setSubmit] = useState(false)

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }

    const handleDateSelect = (date) => {
        setStartDate(date.selection.startDate)
        setEndDate(date.selection.endDate)
        setDateChange(true)
    }

    const handleFilterDate = () => {
        console.log(startDate, endDate)
        axios.post(`${domain}api/filter-history/`, {
            start_date: startDate,
            end_date: endDate
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
                setSubmit(true)
                setIsMount(true)
            }
        }).catch(() => {
            throw new Error('Server Refused. Try again later.')
        })
    }

    const handleClear = () => {
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
                
                setStartDate(new Date())
                setEndDate(new Date())
                setDateChange(false)
                setSubmit(false)
                setIsMount(true)
            }
        })
    }
    const [showRemark, setShowRemark] = useState(false)
    const handleCloseRemark = () => setShowRemark(false)
    const handleOpenRemark = (this_remark) => {
        setShowRemark(true)
        setMyRemark(this_remark)
    }

    const [myRemark, setMyRemark] = useState('')

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
                                <th>Alt-Tab</th>
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
                                        <td>{item.change_tab_count}</td>
                                        {/* <td>{item.task_remark}</td> */}
                                        <td><Button onClick={() => handleOpenRemark(item.remark)} variant="success" block>View Remark</Button></td>
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
                        
                
                <div className='mb-5'>
                    <div className="mt-5">
                        <div className="row">
                            <div className="col mt-2">
                                <span className="h6 font-weight-bold text-muted float-left">All History</span>
                            </div>
                            <div className="col">
                                {submit === true 
                                ? <Button onClick={() => handleClear()} variant="outline-primary" className="float-right ml-2">Clear Date</Button>
                                : <Button onClick={() => handleFilterDate()} variant="outline-primary" className="float-right ml-2">Filter Date</Button>
                                }
                                

                                <div className="float-right">
                                    {submit === true ? null :
                                    <OverlayTrigger
                                        trigger="click"
                                        key="bottom"
                                        placement="bottom"
                                        rootClose
                                        overlay={
                                            <Popover style={{ maxWidth: '650px' }} id={`popover-positioned-bottom`}>
                                                <Popover.Content>
                                                    <DateRangePicker
                                                        ranges={[selectionRange]}
                                                        onChange={handleDateSelect}
                                                    />
                                                </Popover.Content>
                                            </Popover>
                                        }
                                    >   
                                        <Button style={{ background: 'white' }} className="border text-dark" block>
                                            <div className="float-left">
                                            <DateRangeIcon /> 
                                            <span className="ml-2">{dateChange === false ? 'Select Date' : <span>
                                            {Moment(startDate).format('MMM DD')} - {Moment(endDate).format('MMM DD')}
                                            </span>}</span>
                                            </div>
                                        </Button>
                                    </OverlayTrigger>
                                    }
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    
                    {allHistory.length === 0 ? 
                    <h5 className="text-center muted font-weight-bold">No available history.</h5> :
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
                            {allHistory.map((item, index) => {
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
                                            <Button onClick={() => handleDeleteShow(item.id, item.task)} block variant="danger" block>Delete</Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                    }
                </div>
               
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

export default HistoryComponent