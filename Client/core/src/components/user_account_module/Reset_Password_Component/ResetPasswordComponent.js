import React from 'react'
import { Container, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom'

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// Image
import reset_password from '../../../assets/user_account/reset_password.png'

// Context
import { ResponsiveContext } from '../../../App'


import { CircularProgress } from '@material-ui/core'

// Component
import StatusComponent from './StatusComponent'

// Url
import { 
    validate_reset_password_request_url, 
    validate_email_exist_request_url 
} from '../../../static/api_request_urls'

// Redux
import { useSelector, useDispatch} from 'react-redux'
import { 
    setData,
    setField, 
    setFormValid, 
    setLoading, 
    setShow, 
    setStatus
} from '../../../redux/user_account_module/actions/reset_password_reducer'

function ResetPasswordComponent(){
    const context = React.useContext(ResponsiveContext)

    const { email, token } = useParams()
    const state = useSelector(state => state.ResetPasswordReducer)
    const dispatch = useDispatch()

    const [viewPassword, setViewPassword] = React.useState(false)
    const [viewConfirmPassword, setViewConfirmPassword] = React.useState(false)

    let margin = "row featurette mt-5"
    if(context){
        margin = "row featurette mt-2"
    }

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


            const validate_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    new_password: state.new_password,
                    confirm_password: state.confirm_password
                })
            }
    
            dispatch(setLoading(true))
    
            fetch(validate_reset_password_request_url, validate_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    throw new Error('Server Connection Refused. Try again later.')
                }
                
            }).then( data => {
                if(data.status === 'OK'){
                    dispatch(setStatus(true))
                    dispatch(setShow(false))
                }else{
                    dispatch(setData(data))
                    dispatch(setShow(true))
                    dispatch(setLoading(false))
                }
            }).catch(() => {
                dispatch(setFormValid(false))
                dispatch(setShow(true))
                dispatch(setLoading(false))
                throw new Error("Server Connection Refused. Try again later.")
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
                            <h2 className="featurette-heading font-weight-bold">Reset Password</h2>
                            <span className="lead text-muted">
                                {state.status ? <div>You can now login to continue.</div> : <div>Please provide all required details.</div>}
                            </span>

                            <div className="mt-4">
                                {state.isShow 
                                    ? <div>
                                    {state.data 
                                        ? <div>
                                            {state.data.status !== 'success' 
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
                                {state.status
                                ? <StatusComponent context={context}/>
                                :
                                <div>
                                    <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>New Password</Form.Label>
                                            <InputGroup>
                                            <Form.Control 
                                                name="new_password"
                                                type={viewPassword === true ? "text" : "password" }
                                                placeholder="New Password" 
                                                autoComplete="on"
                                                name="new_password"
                                                value={state.new_password}
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
                                                name="confirm_password"
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
                                            
                                        </Form.Group>
                                        <Button type="submit" className="float-right m-1" variant="success" size="md" disabled={state.isLoading}>
                                            {state.isLoading ? <div>Loading <CircularProgress size={25} className="ml-2 float-right" /></div> : <div>Reset password</div>}
                                        </Button>
                                    </Form>
                                </div>
                                }
                                
                            </div>
                        </div>
                        {context && state.status ? <div></div> :
                        <div className="col-md-6">
                            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" src={reset_password} alt="Reset Password"></img>
                        </div>
                        }
                    </div>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default ResetPasswordComponent