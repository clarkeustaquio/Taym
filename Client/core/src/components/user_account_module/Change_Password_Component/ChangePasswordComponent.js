import React from 'react'
import { Container, Button, Form } from 'react-bootstrap';

import change_password from '../../../assets/user_account/change_password.png'
import { ResponsiveContext } from './../../../App'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import {
    setAlert,
    setData,
    setField,
    setFormValid,
    setLoading,
    setPrompt
} from '../../../redux/user_account_module/actions/change_password_action'
 
function ChangePasswordComponent(){
    const context = React.useContext(ResponsiveContext)

    const state = useSelector(state => state.ChangePasswordReducer)
    const dispatch = useDispatch()

    const handleFiled = (event) => {
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

            const token = localStorage.getItem('token')
            const change_password_request = {
                method: 'POST',
                headers: {
                    'Content-Tyoe': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    username: state.email,
                    old_password: state.old_password,
                    new_password: state.new_password,
                    confirm_password: state.confirm_password
                })
            }
            fetch('http://localhost:8000/api/change-password/', change_password_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    throw new Error('Server Failed')
                }
            }).then( data => {
                
            }).catch(() => {
                throw new Error('Server Failed')
            })


        }

        dispatch(setFormValid(true))
    }

    let margin = "row featurette mt-5"

    if(context){
        margin = "row featurette mt-2"
    }

    return (
        <React.Fragment>
            <Container>
                <Container fluid className="h-100">
                    <div className={margin}>
                        <div className="col-md-6">
                            <h2 className="featurette-heading font-weight-bold">Change Password</h2>
                            <span className="lead text-muted">Please provide all required details.</span>
                            <div className="mt-4">
                                <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control 
                                            name="email"
                                            type="email" 
                                            placeholder="Enter email" 
                                            value={state.email}
                                            onChange={handleFiled}
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control 
                                            name="old_password"
                                            type="password" 
                                            placeholder="Old Password" 
                                            autoComplete="on"
                                            value={state.old_password}
                                            onChange={handleFiled}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control 
                                            name="new_password"
                                            type="password" 
                                            placeholder="New Password" 
                                            autoComplete="on"
                                            value={state.new_password}
                                            onChange={handleFiled}
                                            required
                                        />
                                            <Form.Text className="text-muted">
                                                Your password must be 8-20 characters long,
                                                contain letters and numbers, and must not 
                                                contain spaces, special characters, or emoji.
                                            </Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Control
                                            name="confirm_password" 
                                            type="password" 
                                            placeholder="Confirm Password" 
                                            autoComplete="on"
                                            value={state.confirm_password}
                                            onChange={handleFiled}
                                            required
                                        />
                                    </Form.Group>
                                    <Button type="submit" className="float-right m-1" variant="success" size="md">
                                        Change password
                                    </Button>
                                </Form>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" src={change_password} alt="Change Password"></img>
                        </div>
                    </div>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default ChangePasswordComponent