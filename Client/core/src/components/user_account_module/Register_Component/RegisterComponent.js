import React from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ResponsiveContext } from '../../../App'

// Component
import FormComponent from './FormComponent'
import StatusComponent from './StatusComponent'

// Icons
import ForwardIcon from '@material-ui/icons/Forward';

// Images
import register from '../../../assets/user_account/registration.png'

function RegisterComponent(){
    const context = React.useContext(ResponsiveContext)
    let margin = "row featurette mt-5"
    if(context){
        margin = "row featurette mt-2"
    }

    const [status, setStatus] = React.useState(false)

    React.useEffect(() => {
        if(status){
            window.scroll({top: 0, left: 0, behavior: 'smooth' })
        }
    })

    return (
        <React.Fragment>
            <Container>
                <Container fluid className="h-100">
                    <div className={margin}>
                        <div className="col-md-6">
                            <h2 className="featurette-heading font-weight-bold">Registration {status ? 'Complete' : '' }</h2>
                            {status ?
                            <span className="lead text-muted">Please check your email for account activation.</span>
                            : <span className="lead text-muted">Please provide all required details.</span>
                            }
                            
                            <div className="mt-4">
                                {status ? 
                                <StatusComponent />
                                : <FormComponent setStatus={setStatus}/>
                                }
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" src={register} alt="Registration"></img>
                            <p className="lead text-muted text-justify" style={{ textIndent: '50px'}}>We combine our technological capabilities with our team of in-house KMLNGMLKS professionals in handling all facets of your back-office processes.</p>
                            <Link to='/login'>
                                <Button className="float-right" variant="success" size="md">
                                    Discover <ForwardIcon />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default RegisterComponent
