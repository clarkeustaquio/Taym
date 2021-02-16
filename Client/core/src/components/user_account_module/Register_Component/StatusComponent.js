import React from 'react'

function StatusComponent(){
    return (
        <React.Fragment>
            <p className="lead">We’ve emailed you instructions for activating your account. If you don’t receive an email, please make sure you’ve entered the address you registered with, and check your spam folder.</p>
            {/* <span className="lead text-muted">Click here to resend your activation email: <a href="http://localhost:8000/">Activate account</a></span> */}
        </React.Fragment>
    )
}

export default StatusComponent 