import React from 'react'
import { Button } from 'react-bootstrap'

import { useParams, useHistory, Link } from 'react-router-dom'

// Images
// import account_activated from '../../../assets/common_module/account_activated.png'
import activation_success from '../../../assets/user_account/activation_success.png'

// Url
import { activate_account_request_url } from '../../../static/api_request_urls'

function ActivatedComponent(){
    const history = useHistory()
    const { uid, token } = useParams()
    
    React.useEffect(() => {
        const activation_request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid: uid,
                token: token
            })
        }

        fetch(activate_account_request_url, activation_request)
        .then( response => {
            if(response.ok){
                return response.json()
            }else{
                throw new Error('Server Failed')
            }
        }).then( data => {
            if(data.auth === 'INVALID'){
                history.push('/')
            }
        }).catch(() => {
            throw new Error('Server Failed')
        })
    })

    return (
        <React.Fragment>
            <div className="text-center">
            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="600" height="500" src={activation_success} alt="activation_success"></img>
                <h3 className="text-muted text-center">Your account has been successfully activated!</h3>
                <p className="text-muted lead">You can now login with the username and password you provided when you signed up.</p>
                <Link to='/'>
                    <Button type="submit" variant="success" size="md" >
                    Taym
                    </Button>
                </Link>
            </div>
        </React.Fragment>
    )
}

export default ActivatedComponent