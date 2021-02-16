import React from 'react'
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import RegisterComponent from '../user_account_module/Register_Component/RegisterComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'
import { Redirect } from 'react-router-dom'

function RegisterHelper(){
    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to='/home' />
            :<div id="root">
                <NavbarComponent />
                <RegisterComponent />
                <WaveComponent />
            </div>
            }
        </React.Fragment>
    )
}

export default RegisterHelper