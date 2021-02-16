import React from 'react'
import { Redirect } from 'react-router-dom'

// Components
import ActivatedComponent from '../user_account_module/Activated_Component/ActivateComponent'
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'

function ActivatedHelper(){
    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to="/home" />
            : <div id="root">
                <NavbarComponent />
                <ActivatedComponent />
                <WaveComponent />
            </div>
            }
        </React.Fragment>
    )
}

export default ActivatedHelper