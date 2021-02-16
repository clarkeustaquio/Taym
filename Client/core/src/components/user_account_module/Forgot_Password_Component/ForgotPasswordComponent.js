import React from 'react'
import { Container, Button, Form, Alert } from 'react-bootstrap';

import forgot_password from '../../../assets/user_account/forgot_password.png'
import { ResponsiveContext } from '../../../App'

import { CircularProgress } from '@material-ui/core'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { 
    setEmail, 
    setFormValid, 
    setLoading, 
    setSuccess,
    setAlert,
    setPrompt
} from '../../../redux/user_account_module/actions/forgot_password_action'

// Url
import { reset_password_request_url } from '../../../static/api_request_urls'

function ForgotPasswordComponent(){
    const context = React.useContext(ResponsiveContext)
    const state = useSelector(state => state.ForgotPasswordReducer)
    const dispatch = useDispatch()

    let margin = "row featurette mt-5"
    if(context){
        margin = "row featurette mt-2"
    }

    const handleEmail = (event) => {
        dispatch(setEmail({
            name: event.target.name,
            value: event.target.value
        }))
    }

    const handleForgot = () => {
        window.location.reload()
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

            const forgot_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: state.email 
                })
            }
            fetch(reset_password_request_url, forgot_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }
                else{
                    throw new Error
                }
            }).then( data => {
                if(data.status === 'OK'){
                    dispatch(setLoading(false))
                    dispatch(setSuccess(true))
                }else{
                    dispatch(setPrompt(data.message))
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                }
            }).catch(() => {
                dispatch(setAlert(false))
                dispatch(setLoading(false))
                dispatch(setFormValid(false))
                throw new Error('Server Connection Refused. Try again later.')
            })
        }

        dispatch(setFormValid(true))
    }

    
    return (
        <React.Fragment>
            <Container>
                <Container fluid className="h-100">
                    <div className={margin}>
                        <div className="col-md-6">
                            <h2 className="featurette-heading font-weight-bold">Forgot Password</h2>
                                {state.isSuccess 
                                ? <span className="lead text-muted">Password reset sent. </span>
                                : <span className="lead text-muted">Please provide all required details. </span>
                                }
                       

                            <div className="mt-4">
                                {state.isSuccess
                                ? <div>
                                    <p className="lead">We’ve emailed you instructions for setting your password, if an account exists with the email you entered. You should receive them shortly.</p>
                                    <p className="lead">If you don’t receive an email, please make sure you’ve entered the address you registered with, and check your spam folder</p>
                                    <Button className="float-right mt-3" variant="success" size="md" onClick={handleForgot}>
                                        Forgot Password
                                    </Button>
                                </div>
                                :
                                <div>
                                {state.isAlert ? <Alert variant="danger" onClose={() => dispatch(setAlert(false))} dismissible>
                                    {state.set_prompt}
                                </Alert> : <div></div>
                                }
                                    <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control 
                                                name="email"
                                                type="email" 
                                                placeholder="Enter email"
                                                value={state.email}
                                                onChange={handleEmail}
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                            </Form.Text>
                                        </Form.Group>
                                        <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={state.isLoading}>
                                            {state.isLoading ? <div>Sending <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Submit</div> }
                                        </Button>
                                    </Form>
                                </div>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" src={forgot_password} alt="Forgot Password"></img>
                        </div>
                    </div>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default ForgotPasswordComponent