import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Button, Alert, InputGroup, Dropdown, Row, DropdownButton } from 'react-bootstrap'
import { Link, Redirect, useHistory, useParams } from 'react-router-dom'

import { CircularProgress, Input } from '@material-ui/core'

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// Countries
import { countries } from '../../../static/country'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import {
    setData,
    setField,
    setFormValid,
    setLoading,
    setShow,
    setPositions,
    setDepartments,
    setSections
} from '../../../redux/user_account_module/actions/registration_action'

// Modal
import PrivacyPolicyComponent from '../Privacy_Policy_Component/PrivacyPolicyComponent'

// Url
import { registration_parent_request_url, registration_get_request_url } from '../../../static/api_request_urls'

// function ParentFormComponent({ setStatus, setIsProceed }){
function ParentFormComponent({ setStatus }){
    const history = useHistory()

    const state = useSelector(state => state.RegistrationReducer)
    const dispatch = useDispatch()

    const [viewPassword, setViewPassword] = useState(false)
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false)

    const [modalShow, setModalShow] = useState(false)

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [studentEmail, setStudentEmail] = useState('')

    const [firtName, setFirstName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [lastName, setLastName] = useState('')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [isShow, setIsShow] = useState(false)

    const [data, setData] = useState({})

    const [formValid, setFormValid] = useState(false)

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if(form.checkValidity() === false){
            event.preventDefault()
            event.stopPropagation()
        }else if(form.checkValidity() === true){
            event.preventDefault()
            event.stopPropagation()

            const registration_request = {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // email: email,
                    username: username,
                    student_email: studentEmail,
                    first_name: firtName,
                    last_name: lastName,
                    middle_name: middleName,
                    password: password,
                    confirm_password: confirmPassword,  
                })
            }
    
            setIsLoading(true)
    
            fetch(registration_parent_request_url, registration_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    setIsLoading(false)
                    history.push('/')
                }
                
            }).then( data => {
                if(data.status === 'OK'){
                    setStatus(true)
                    setIsShow(false)
                    setIsLoading(false)
                    setFormValid(false)
                }else{
                    setData(data)
                    setIsShow(true)
                    setIsLoading(false)
                }
            }).catch(() => {
                setFormValid(false)
                setIsLoading(false)
                setIsShow(false)
                throw new Error('Server Connection Refused. Try again later.')
            })

        }

        setFormValid(true)
    }

    return (
        <React.Fragment>
            {isShow 
                ? <div>
                {data 
                    ? <div>
                        {data.status !== 'OK' 
                        ? <Alert variant="danger" onClose={() => setIsShow(false)} dismissible>
                            {Object.keys(data).map((validator, id) => {
                                return <li key={id}>{data[validator]}</li>
                            })} 
                        </Alert> 
                        : null}
                    </div>
                    : null }
                </div> 
                : null
            }           
                <Form noValidate validated={formValid} onSubmit={handleSubmit}>
                        {/* <Form.Group controlId="emailForm">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                name="email"
                                type="email" 
                                placeholder="Email address" 
                                value={email} 
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />

                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group> */}

                        <Form.Group controlId="username">
                            <Form.Row>
                                <Col>
                                    <Form.Control 
                                        name="username"
                                        type="text" 
                                        placeholder="Username" 
                                        value={username}
                                        onChange={(event) => setUsername(event.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control 
                                        name="student_email"
                                        type="text" 
                                        placeholder="Student Username" 
                                        value={studentEmail}
                                        onChange={(event) => setStudentEmail(event.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Row>
                            
                        </Form.Group>

                        <Form.Group>
                            <Form.Row>
                                <Col>
                                    <Form.Control 
                                        name="first_name"
                                        type="text" 
                                        placeholder="First name" 
                                        value={firtName}
                                        onChange={(event) => setFirstName(event.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control 
                                        name="last_name"
                                        type="text" 
                                        placeholder="Last name" 
                                        value={lastName}
                                        onChange={(event) => setLastName(event.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control 
                                        name="middle_name"
                                        type="text" 
                                        placeholder="Middle name" 
                                        value={middleName}
                                        onChange={(event) => setMiddleName(event.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    name="password"
                                    type={viewPassword === true ? "text" : "password" }
                                    placeholder="Password" 
                                    autoComplete="on"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text type="button" style={{ backgroundColor: 'white'}} onClick={() => setViewPassword(!viewPassword)}>
                                        {viewPassword === true 
                                            ? <VisibilityOffIcon />
                                            : <VisibilityIcon />
                                        }
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            <Form.Text className="text-muted">
                            Your password must be at least (10) characters long,
                            which consist of at least (1) uppercase letter, 1 lowercase letter, 
                            1 number and 1 special character.
                            </Form.Text>
                        </Form.Group>



                        <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>
                                <Form.Control 
                                    name="confirm_password"
                                    type={viewConfirmPassword === true ? "text" : "password" }
                                    placeholder="Confirm Password" 
                                    autoComplete="on"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text type="button" style={{ backgroundColor: 'white'}} onClick={() => setViewConfirmPassword(!viewConfirmPassword)}>
                                        {viewConfirmPassword === true 
                                            ? <VisibilityOffIcon />
                                            : <VisibilityIcon />
                                        }
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Please make sure your password match.</Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group controlId="checkboxForm">
                            {/* <Form.Row>
                            <Form.Check name="privacy_policy" type="checkbox" label="I Accept this sites " required/>
                            <span className="ml-n2 btn btn-link mt-n2" onClick={() => setModalShow(true)}>Privacy policy.</span>
                            </Form.Row> */}
                            
                        </Form.Group>
                        {/* <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={isLoading}>
                            {isLoading ? <div>Loading <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Submit</div>}
                        </Button> */}
                        <Button type="submit" className="float-right" variant="success" size="md" disabled={isLoading}>
                            {isLoading ? <div>Loading <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Submit</div>}
                        </Button>
                        {/* <Link to='/login'> */}
                            {/* <Button onClick={() => setIsProceed(false)} className="float-right m-1" variant="danger" size="md">
                                Cancel
                            </Button> */}
                        {/* </Link>  */}
                    </Form>
                    <PrivacyPolicyComponent modalShow={modalShow} setModalShow={setModalShow}/>
        </React.Fragment>
    )
}

export default ParentFormComponent