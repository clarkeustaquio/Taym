import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import reset_success from '../../../assets/user_account/reset_success.png'

function StatusComponent({ context }){
    return (
        <React.Fragment>
            <p className="lead">
                You have successfuly changed your password.
                {context ? null
                :<Link to="/login">
                    <Button className="ml-3" variant="success" size="md">
                        LOGIN
                    </Button>
                </Link>
                }
                
            </p>
            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" src={reset_success} alt="Reset Password"></img>
            
            {context ? <Link to="/login">
                <Button className="float-right mt-3" variant="success" size="md">
                    LOGIN
                </Button>
            </Link>
            : null
            }
        </React.Fragment>
    )
}

export default StatusComponent