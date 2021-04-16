import React from 'react'
import { Redirect } from 'react-router-dom'

// Components
import ParentComponent from '../user_account_module/Parent_Component/ParentComponent'
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'

function ChildHelper(){
    return (
        <React.Fragment>
            {localStorage.getItem('token')
            ? <Redirect to="/home" />
            : <div id="root">
                <NavbarComponent />
                <ParentComponent />
                {/* <WaveComponent /> */}
            </div>
            }
        </React.Fragment>
    )
}

export default ChildHelper