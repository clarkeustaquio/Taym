import React from 'react'
import { Container, Button, Form, Alert, Modal } from 'react-bootstrap';

import { ResponsiveContext } from './../../../App'

import { CircularProgress } from '@material-ui/core'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import {
    setAlert,
    setField,
    setFormValid,
    setLoading,
    setPrompt,
    setShow,
} from '../../../redux/user_account_module/actions/change_email_action'
 
function ChangeEmailComponent(){
    const context = React.useContext(ResponsiveContext)

    const state = useSelector(state => state.ChangeEmailReducer)
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

            dispatch(setLoading(true))
            
            const token = localStorage.getItem('token')
            const change_email_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token,
                },
                body: JSON.stringify({
                    email: state.email,
                })
            }
            
            fetch('https://taym.herokuapp.com/api/change-email/', change_email_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
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
                }else if(data.status === 'NOT_FOUND'){
                    dispatch(setPrompt('Email address not found. Please Contact us'))
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                }else{
                    dispatch(setPrompt(data.invalid_email))
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                }
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

    const email = localStorage.getItem('email')

    return (
        <React.Fragment>
            <Container>
                <Container className="mb-5">
                <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                    {/* <Form.Group>
                        <p className="font-weight-bold">Current Email: {email}</p>
                    </Form.Group> */}

                    {state.isAlert ? <Alert variant="danger" onClose={() => dispatch(setAlert(false))} dismissible>
                        {state.set_prompt}
                    </Alert> : <div></div>
                    }
                    <Form.Group controlId="changeEmail">
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

                    <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={state.isLoading}>
                        {state.isLoading ? <div>Sending <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Change Email</div> }
                    </Button>
                </Form>

                <Modal show={state.isShow} centered onHide={() => dispatch(setShow(true))}> 
                <Modal.Header>
                    <Modal.Title>Change email successful</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <p>You have successfully changed your email.</p>
                        <p>Redirecting to login page in a second.</p>
                    </Modal.Body>
                </Modal>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default ChangeEmailComponent