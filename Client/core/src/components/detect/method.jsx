import axios from 'axios'
import { domain } from '../../static/api_request_urls'

export const type = 'blur'

export function onListener({ 
    isVisible, 
    setIsVisible 
}){
    const token = localStorage.getItem('token')
    console.log('Hello')
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
}

export function clearListener({ setIsVisible }){
    setIsVisible(true)
}