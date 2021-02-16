import React from 'react'
import { Form, Col, Button, Alert, InputGroup } from 'react-bootstrap'
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
import { registration_request_url, registration_get_request_url } from '../../../static/api_request_urls'

function FormComponent({ setStatus }){
    const history = useHistory()
    const state = useSelector(state => state.RegistrationReducer)
    const dispatch = useDispatch()

    const [viewPassword, setViewPassword] = React.useState(false)
    const [viewConfirmPassword, setViewConfirmPassword] = React.useState(false)

    const [modalShow, setModalShow] = React.useState(false)

    const handleInput = (event) => {
        dispatch(setField({
            name: event.target.name,
            value: event.target.value
        }))
    }

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
                    email: state.email,
                    username: state.username,
                    first_name: state.first_name,
                    last_name: state.last_name,
                    middle_name: state.middle_name,
                    password: state.password,
                    confirm_password: state.confirm_password,  
                })
            }
    
            dispatch(setLoading(true))
    
            fetch(registration_request_url, registration_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    dispatch(setLoading(false))
                    history.push('/')
                }
                
            }).then( data => {
                if(data.status === 'OK'){
                    setStatus(true)
                    dispatch(setShow(false))
                    dispatch(setLoading(false))
                    dispatch(setFormValid(false))
                }else{
                    dispatch(setData(data))
                    dispatch(setShow(true))
                    dispatch(setLoading(false))
                }
            }).catch(() => {
                dispatch(setFormValid(false))
                dispatch(setLoading(false))
                dispatch(setShow(false))
                throw new Error('Server Connection Refused. Try again later.')
            })

        }

        dispatch(setFormValid(true))
    }

    React.useEffect(() => {
        // const registration_get = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // }

        // fetch(registration_get_request_url, registration_get)
        // .then( response => {
        //     if(response.ok){
        //         return response.json()
        //     }else{
        //         throw new Error('Server Connection Refused. Try again later.')
        //     }
        // }).then( data => {
        //     dispatch(setPositions(data.positions))
        //     dispatch(setDepartments(data.departments))
        //     dispatch(setSections(data.sections))
        //     // setPosition(data.positions[0])
        //     // setDepartment(data.departments[0])
        //     // setSection(data.section[0])
        // })
    }, [])

    return (
        <React.Fragment>
            {state.isShow 
                ? <div>
                {state.data 
                    ? <div>
                        {state.data.status !== 'OK' 
                        ? <Alert variant="danger" onClose={() => dispatch(setShow(false))} dismissible>
                            {Object.keys(state.data).map((validator, id) => {
                                return <li key={id}>{state.data[validator]}</li>
                            })} 
                        </Alert> 
                        : null}
                    </div>
                    : null }
                </div> 
                : null
            }
            
            <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                <Form.Group controlId="emailForm">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        name="email"
                        type="email" 
                        placeholder="Email address" 
                        value={state.email} 
                        onChange={handleInput}
                        required
                    />

                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                    
                </Form.Group>

                <Form.Group controlId="username">
                    <Form.Row>
                        <Col>
                            <Form.Control 
                                name="username"
                                type="text" 
                                placeholder="Username" 
                                value={state.username}
                                onChange={handleInput}
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
                                value={state.first_name}
                                onChange={handleInput}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Control 
                                name="last_name"
                                type="text" 
                                placeholder="Last name" 
                                value={state.last_name}
                                onChange={handleInput}
                                required
                            />
                        </Col>
                        <Col>
                            <Form.Control 
                                name="middle_name"
                                type="text" 
                                placeholder="Middle name" 
                                value={state.middle_name}
                                onChange={handleInput}
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
                            value={state.password}
                            onChange={handleInput}
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
                            value={state.confirm_password}
                            onChange={handleInput}
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
                    <Form.Row>
                    <Form.Check name="privacy_policy" type="checkbox" label="I Accept this sites " required/>
                    <span className="ml-n2 btn btn-link mt-n2" onClick={() => setModalShow(true)}>Privacy policy.</span>
                    </Form.Row>
                    
                </Form.Group>
                <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={state.isLoading}>
                    {state.isLoading ? <div>Loading <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Submit</div>}
                </Button>
                <Link to='/login'>
                    <Button className="float-right m-1" variant="danger" size="md">
                        Cancel
                    </Button>
                </Link> 
            </Form>
            <PrivacyPolicyComponent modalShow={modalShow} setModalShow={setModalShow}/>
        </React.Fragment>
    )
}

export default FormComponent