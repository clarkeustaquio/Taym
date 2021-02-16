import React from 'react'
import { InputGroup, Form, FormControl, Alert, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core';

// Icons
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import PersonIcon from '@material-ui/icons/Person';

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { 
    setField,
    setAlert,
    setLoading,
    setPrompt,
    setFormValid
} from '../../../redux/user_account_module/actions/login_action'


// Url
import { login_request_url } from '../../../static/api_request_urls'

function FormComponent(){
    const history = useHistory()

    const state = useSelector(state => state.LoginReducer)
    const dispatch = useDispatch()

    const [viewPassword, setViewPassword] = React.useState(false)

    const handleField = (event) => {
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
            const login_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: state.email,
                    password: state.password
                })
            }

            fetch(login_request_url, login_request)
            .then( response => {
                if(response.ok){
                    return response.json()  
                }else{
                    throw Error('Server Connection Refused. Try again later.')
                }   
            }).then( data => {
                if(data.status === 'OK'){
                    if(data.email){
                        if(data.token){
                            localStorage.setItem('token', data.token)
                            localStorage.setItem('email', data.email)
                            localStorage.setItem('first_name', data.first_name)
                            localStorage.setItem('last_name', data.last_name)
                            localStorage.setItem('username', data.username)
                            
                            dispatch(setAlert(false))
                            dispatch(setLoading(false))
                            if(data.is_expired === false){
                                history.push('/')
                            }else{
                                localStorage.setItem('is_expired', data.is_expired)
                                history.push('/home/settings')
                            }
                        }
                    }else{
                        dispatch(setPrompt(data.message))
                        dispatch(setAlert(true))
                        dispatch(setLoading(false))
                    }
                }else{
                    dispatch(setPrompt(data.message))
                    dispatch(setAlert(true))
                    dispatch(setLoading(false))
                }
            }).catch(() => {
                dispatch(setPrompt('Server Connection Refused. Try again later.'))
                dispatch(setAlert(true))
                dispatch(setLoading(false))
            })
        }
        dispatch(setFormValid(true))
    }
    return (
        <React.Fragment>
            {state.isAlert ? <Alert variant="danger" onClose={() => dispatch(setAlert(false))} dismissible>
                {state.set_prompt}
            </Alert> : <div></div>
            }
            <Form noValidate validated={state.validated_form} onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="email"><PersonIcon /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        name="email"
                        placeholder="Username"
                        aria-label="email"
                        aria-describedby="email"
                        value={state.email} 
                        onChange={handleField}
                        required
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                    <InputGroup.Text id="password"><VpnKeyIcon /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        // style={{ borderRight: 'none' }}
                        name="password"
                        type={viewPassword === true ? "text" : "password" }
                        placeholder="Password"
                        aria-label="password"
                        aria-describedby="password"
                        autoComplete="on"
                        value={state.password} 
                        onChange={handleField}
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

                <p className="float-right"><Link to='/forgot-password'>Forgot Password?</Link></p>
                <Button type="submit" variant="success" size="lg" block disabled={state.isLoading}>
                    {state.isLoading ? <CircularProgress size={25} /> : <div>LOGIN</div> }
                </Button>
            </Form>
        </React.Fragment>
    )
}

export default FormComponent