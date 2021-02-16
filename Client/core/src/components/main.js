import React from 'react'
import { useHistory } from 'react-router-dom'

import { CircularProgress } from '@material-ui/core'

// Component
import MainComponent from './Main_Component/MainComponent'

// Url
import { authorize_token_request_url } from '../static/api_request_urls'

const isAuthenticated = () => {
    const authenticated = localStorage.getItem('token')
    return authenticated
}

function MainHelper(){
    const history = useHistory()
    const [isAuth, setAuth] = React.useState(false)

    React.useEffect(() => {
        const token = isAuthenticated()

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
                fetch(authorize_token_request_url, validate_token)
                .then((response) => {
                    if(response.status === 200){
                        setAuth(true)
                    }else if(response.status === 401){
                        localStorage.clear()
                        history.push('/login')
                    }
                }).catch(() => {
                    throw new Error('Server Connection Refused. Try again later.')
                })
            }
        }
    }, [isAuth, history])

    return (
        <React.Fragment>
            {isAuth === true
            ? <MainComponent />
            : <CircularProgress size={50} style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                marginTop: "-50px",
                marginLeft: "-100px"
            }}/>
            }
        </React.Fragment>
    )
}

export default MainHelper