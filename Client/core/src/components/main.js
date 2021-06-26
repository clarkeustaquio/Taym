import 
React, { 
    useEffect, 
    useState
} from 'react'

import { useHistory } from 'react-router-dom'

import { CircularProgress } from '@material-ui/core'

// Component
import MainComponent from './Main_Component/MainComponent'

// Url
import { authorize_token_request_url } from '../static/api_request_urls'
import axios from 'axios'
import { domain } from '../static/api_request_urls'

import { 
    onListener, 
    clearListener, 
    type 
} from './detect/method'

const isAuthenticated = () => {
    const authenticated = localStorage.getItem('token')
    return authenticated
}

function MainHelper(){
    const token = localStorage.getItem('token')
    const history = useHistory()
    const [isAuth, setAuth] = React.useState(false)
    const [isVisible, setIsVisible] = React.useState(true)

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

    // React.useEffect(() => {
    //     window.addEventListener(type, onListener(
    //         isVisible, setIsVisible), false)

    //     return () => {
    //         window.removeEventListener(type, clearListener(
    //             setIsVisible), false)
    //     }
    // })

    React.useEffect(() => {
        window.addEventListener('blur', () => {
          if(token !== null){
              if(isVisible){
                axios.get(`${domain}api/check-visibility/`, {
                    headers: {
                        'Authorization': 'Token ' + token
                    }
                }).then(response => {
                    if(response.status === 200){
                        setIsVisible(false)
                    }else if(response.status === 401){
                        setIsVisible(true)
                    }else{
                        setIsVisible(true)
                    }
                }).catch((error) => {
                    if(error.error !== 'OK'){
                        setIsVisible(true)
                    }

                    throw new Error('Server Refused. Try again later.')
                })
              }
          }
        }, false)
    
        return () => {
          window.removeEventListener('blur', () => {
            setIsVisible(true)
          }, false);
        }
      }, [])

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