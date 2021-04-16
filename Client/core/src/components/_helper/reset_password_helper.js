import React from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'

// Components
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import ResetPasswordComponent from '../user_account_module/Reset_Password_Component/ResetPasswordComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'

import { CircularProgress } from '@material-ui/core'

// Url
import { validate_email_exist_request_url } from '../../static/api_request_urls'
function ResetPasswordHelper(){
    const history = useHistory()
    const { email, token } = useParams()
    const [isEmailValid, setEmailValid] = React.useState(false)

    React.useEffect(() => {
        if(!isEmailValid){
            const validate_email_request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    token: token
                })
            }
            fetch(validate_email_exist_request_url, validate_email_request)
            .then( response => {
                if(response.ok){
                    return response.json()
                }else{
                    throw new Error('Server Connection Refused. Try again later.')
                }
            }).then( data => {
                if(data.status !== 'OK'){
                    history.push('/login')
                }else{
                    setEmailValid(true)
                }
            }).catch(() => {
                throw new Error('Server Connection Refused. Try again later.')
            })
        }  
    })

    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to='/' />
            :<div id="root">
                {isEmailValid 
                ?<div>
                    <NavbarComponent />
                    <ResetPasswordComponent />
                    {/* <WaveComponent /> */}
                </div>
                : <CircularProgress size={50} style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    marginTop: "-50px",
                    marginLeft: "-100px"
                }}/>}
                
            </div>
            }
            
        </React.Fragment>
    )
}

export default ResetPasswordHelper