import React from 'react'
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import LoginComponent from '../user_account_module/Login_Component/LoginComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'
import { Redirect } from 'react-router-dom'

function LoginHelper(){

    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to='/home' />
            :<div id="root">
                <NavbarComponent />
                <LoginComponent />
                <WaveComponent />
            </div>
            }
        </React.Fragment>
    )
}

export default LoginHelper