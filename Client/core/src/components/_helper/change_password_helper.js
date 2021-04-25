import React from 'react'

// Components
import NavbarComponent from '../user_account_module/Navbar_Component/NavbarComponent'
import ChangePasswordComponent from '../user_account_module/Change_Password_Component/ChangePasswordComponent'
import WaveComponent from '../user_account_module/Wave_Component/WaveComponent'

import { useHistory } from 'react-router-dom'

function ChangePasswordHelper(){
    const history = useHistory()
    const token = localStorage.getItem('token')
    const [isAuth, setAuth] = React.useState(false)

    const domain = 'http://localhost:8000/'
    const remote = 'https://taym.herokuapp.com/'

    React.useEffect(() => {
        const validate_token = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + token,
            }
        }
        
        if(!isAuth){
            if(!token){
                history.push('/login')
            }else{
                fetch(`${domain}api/authorize-token/`, validate_token)
                .then((response) => {
                    if(response.status === 200){
                        setAuth(true)
                    }else if(response.status === 401){
                        localStorage.clear()
                        history.push('/login')
                    }
                }).catch(() => {
                    throw new Error('Server Failed')
                })
            }
        }
    })


// Your password has expired, please change it now.

    return (
        <React.Fragment>
            {isAuth  === true
            ?<div><NavbarComponent />
                <ChangePasswordComponent />
                {/* <WaveComponent /> */}
            </div>
            :null}
            
        </React.Fragment>
    )
}

export default ChangePasswordHelper