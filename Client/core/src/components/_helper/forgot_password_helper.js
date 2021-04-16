import React from 'react'
import { Redirect } from 'react-router-dom'

// Components
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import ForgotPasswordComponent from '../user_account_module/Forgot_Password_Component/ForgotPasswordComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'

function ForgotPasswordHelper(){
    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to='/home' />
            :<div id="root">
                <NavbarComponent />
                <ForgotPasswordComponent />
                {/* <WaveComponent /> */}
            </div>
            }
        </React.Fragment>
    )
}

export default ForgotPasswordHelper