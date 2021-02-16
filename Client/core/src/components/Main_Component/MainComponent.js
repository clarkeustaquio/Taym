import React from 'react'
import BodyComponent from './Body_Component/BodyComponent'
import NavbarComponent from './Navbar_Component/NavbarComponent'
import {useHistory, Link} from 'react-router-dom'
import { logout_request_url } from '../../static/api_request_urls'

function MainComponent(){
    const history = useHistory()

    const handleLogout = () => {
      const token = localStorage.getItem('token')
      const logout_request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
      }
  
      fetch(logout_request_url, logout_request)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Server Connection Refused. Try again later.')
          }
        }).then((data) => {
          if (data.status === 'OK') {
            localStorage.clear()
            history.push('/login')
          }
        }).catch(() => {
          throw new Error('Server Connection Refused. Try again later.')
        })
    }

    return (
        <React.Fragment>
            <BodyComponent handleLogout={handleLogout} />
        </React.Fragment>
    )
}

export default MainComponent