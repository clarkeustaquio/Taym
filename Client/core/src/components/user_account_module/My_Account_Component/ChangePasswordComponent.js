import React from 'react'
import { Container, Button, Form, Alert, Modal, InputGroup } from 'react-bootstrap';

import { CircularProgress } from '@material-ui/core'

import { ResponsiveContext } from './../../../App'

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// Redux
import { useSelector, useDispatch } from 'react-redux'
import {
    setAlert,
    setData,
    setField,
    setFormValid,
    setLoading,
    setPrompt,
    setShow
} from '../../../redux/user_account_module/actions/change_password_action'
 
function ChangePasswordComponent(){
    const context = React.useContext(ResponsiveContext)

    const state = useSelector(state => state.ChangePasswordReducer)
    const dispatch = useDispatch()

    const handleField = (event) => {
        dispatch(setField({
            name: event.target.name,
            value: event.target.value
        }))
    }

    const username = localStorage.getItem('username')

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if(form.checkValidity() === false){
            event.preventDefault()
            event.stopPropagation()
        }else if(form.checkValidity() === true){
            event.preventDefault()
            event.stopPropagation()

            dispatch(setLoading(true))
            const token = localStorage.getItem('token')
            const change_password_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    username: username,
                    password: state.old_password,
                    new_password: state.new_password,
                    confirm_password: state.confirm_password
                })
            }
            fetch('https://taym.herokuapp.com/api/change-password/', change_password_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    console.log('HELLO')
                    throw new Error('Server Failed')
                }
            }).then( data => {
                if(data.status === 'OK'){
                    dispatch(setAlert(false))
                    dispatch(setLoading(false))
                    dispatch(setFormValid(false))
                    dispatch(setShow(true))
                    setTimeout(() => {
                        localStorage.clear()
                        window.location.reload()
                    }, 3000)
                }else if(data.status === 'BAD'){
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                    dispatch(setData(data))
                    setPasswordAttempt(true)
                    
                    setTimeout(() => {
                        dispatch(setAlert(false))
                        dispatch(setData({}))
                        localStorage.clear()
                        window.location.reload()
                    }, 3000)
                }else{
                    dispatch(setData(data))
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                }
            }).catch((error) => {
                throw new Error('Server Failed')
            })


        }

        dispatch(setFormValid(true))
    }

    let margin = "row featurette mt-5"

    if(context){
        margin = "row featurette mt-2"
    }

    const email = localStorage.getItem('email')

    React.useEffect(() => {
        dispatch(dispatch(setField({
            name: 'email',
            value: email
        })))
    }, [])

    const is_expired = localStorage.getItem('is_expired')
    const [expired, setExpired] = React.useState(is_expired)

    const [passwordAttempt, setPasswordAttempt] = React.useState(false)

    const [viewOldPassword, setViewOldPassword] = React.useState(false)
    const [viewNewPassword, setViewNewPassword] = React.useState(false)
    const [viewConfirmPassword, setViewConfirmPassword] = React.useState(false)
    return (
        <React.Fragment>
            <Container>
                <Container className="mb-5">
                    {/*  */}
                {/* {is_expired === true 
                ? 
                : null} */}
                {expired ? <Alert variant="danger" onClose={() => setExpired(false)} dismissible>
                    Your password has expired, please change it now
                </Alert> 
                : null}
                
                {state.isAlert 
                    ? <div>
                    {state.data 
                        ? <div>
                            {state.data.status !== 'OK' 
                            ? <Alert variant="danger" onClose={() => dispatch(setAlert(false))} dismissible>
                                {Object.keys(state.data).map((validator, id) => {
                                    if(state.data[validator] !== 'BAD')
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
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            name="email"
                            type="email" 
                            placeholder="Enter email" 
                            value={state.email}
                            onChange={handleField}
                            required
                            disabled
                        />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    {/* <Form.Group>
                        <Form.Control 
                            name="old_password"
                            type="password" 
                            placeholder="Old Password" 
                            autoComplete="on"
                            value={state.old_password}
                            onChange={handleField}
                            type={viewPassword === true ? "text" : "password" }
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
                    </Form.Group> */}
                    <InputGroup className="mb-3">
                        <Form.Control 
                                name="old_password"
                                type="password" 
                                placeholder="Old Password" 
                                autoComplete="on"
                                value={state.old_password}
                                onChange={handleField}
                                type={viewOldPassword === true ? "text" : "password" }
                                required
                            />
                        <InputGroup.Append>
                            <InputGroup.Text type="button" style={{ backgroundColor: 'white'}} onClick={() => setViewOldPassword(!viewOldPassword)}>
                                {viewOldPassword === true 
                                    ? <VisibilityOffIcon />
                                    : <VisibilityIcon />
                                }
                            </InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>    





                    {/* <Form.Group>
                        <Form.Control 
                            name="new_password"
                            type="password" 
                            placeholder="New Password" 
                            autoComplete="on"
                            value={state.new_password}
                            onChange={handleField}
                            required
                        />
                            <Form.Text className="text-muted">
                            Your password must be at least (10) characters long,
                            which consist of at least (1) uppercase letter, 1 lowercase letter, 
                            1 number and 1 special character.
                            </Form.Text>
                    </Form.Group> */}

                    <InputGroup className="mb-3">
                        <Form.Control 
                            name="new_password"
                            type="password" 
                            placeholder="New Password" 
                            autoComplete="on"
                            value={state.new_password}
                            onChange={handleField}
                            type={viewNewPassword === true ? "text" : "password" }
                            required
                        />
                        <InputGroup.Append>
                            <InputGroup.Text type="button" style={{ backgroundColor: 'white'}} onClick={() => setViewNewPassword(!viewNewPassword)}>
                                {viewNewPassword === true 
                                    ? <VisibilityOffIcon />
                                    : <VisibilityIcon />
                                }
                            </InputGroup.Text>
                        </InputGroup.Append>
                        <Form.Text className="text-muted">
                            Your password must be at least (10) characters long,
                            which consist of at least (1) uppercase letter, 1 lowercase letter, 
                            1 number and 1 special character.
                        </Form.Text>
                    </InputGroup>







                    {/* <Form.Group>
                        <Form.Control
                            name="confirm_password" 
                            type="password" 
                            placeholder="Confirm Password" 
                            autoComplete="on"
                            value={state.confirm_password}
                            onChange={handleField}
                            required
                        />
                    </Form.Group> */}

                    <InputGroup className="mb-3">
                        <Form.Control
                            name="confirm_password" 
                            type="password" 
                            placeholder="Confirm Password" 
                            autoComplete="on"
                            value={state.confirm_password}
                            onChange={handleField}
                            type={viewConfirmPassword === true ? "text" : "password" }
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





                    <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={state.isLoading}>
                        {state.isLoading ? <div>Sending <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Change Password</div> }
                    </Button>
                </Form>
                {/* For success */}
                <Modal show={state.isShow} centered onHide={() => dispatch(setShow(true))}>
                    <Modal.Header>
                        <Modal.Title>Change password successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You have successfully changed your password.</p>
                        <p>Redirecting to login page in a second.</p>
                    </Modal.Body>
                </Modal>
                {/* Invalid */}
                <Modal show={passwordAttempt} centered onHide={() => dispatch(setPasswordAttempt(true))}>
                    <Modal.Header>
                        <Modal.Title>Account has been locked</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Password attempts exceeded.</p>
                        <p>Redirecting to login page in a second.</p>
                    </Modal.Body>
                </Modal>
                </Container>
            </Container>
            
        </React.Fragment>
    )
}

export default ChangePasswordComponent