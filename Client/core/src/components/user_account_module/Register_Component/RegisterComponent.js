import React from 'react'
import { Container, Button, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { ResponsiveContext } from '../../../App'

// Component
import FormComponent from './FormComponent'
import ParentComponent from './ParentComponent'
import StatusComponent from './StatusComponent'
import StepComponent from './StepComponent'
// Icons
import ForwardIcon from '@material-ui/icons/Forward';

// Images
import register from '../../../assets/user_account/registration.png'
import workforce from '../../../assets/user_account/workforce.png'
import new_era from '../../../assets/user_account/new_era_logo.png'

import './register.css'
function RegisterComponent(){
    const context = React.useContext(ResponsiveContext)
    let margin = "mt-5"
    if(context){
        margin = "mt-2"
    }

    const [status, setStatus] = React.useState(false)
    const [isProceed, setIsProceed] = React.useState(false)
    const [isStudent, setIsStudent] = React.useState(false)

    React.useEffect(() => {
        if(status){
            window.scroll({top: 0, left: 0, behavior: 'smooth' })
        }
    })

    return (
        <React.Fragment>
            <Container className="text-center">
            {isProceed === false 
            ? <div>
             <h1 className="h3 mb-3 mt-5 font-weight-bold">Registration</h1>
             <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="300" height="300" src={new_era} alt="workforce"></img>
                
                <Button className="btn btn-lg btn-primary btn-block mt-5 mb-3" onClick={() => {
                    setIsStudent(false)
                    setIsProceed(true)
                }} variant="success">Register as Parent</Button>

                <Button className="btn btn-lg btn-primary btn-block" onClick={() => {
                    setIsStudent(true)
                    setIsProceed(true)
                }} variant="success">Register as Student</Button>
            </div>
            : <div className="mt-3">
                {isStudent === true 
                    ? <div>
                        <h2 className="featurette-heading font-weight-bold">Student Registration {status ? 'Complete' : '' }</h2>
                        {status ?
                        <span className="lead text-muted">You can now login to your account.</span>
                        : <span className="lead text-muted">Please provide all required details.</span>
                        }
                        
                        <div className="mt-4">
                            {status ? 
                            <StatusComponent />
                            : <FormComponent 
                                setStatus={setStatus}
                                setIsProceed={setIsProceed}
                            />
                            }
                        </div>
                    </div>
                    : <div>
                        <h2 className="featurette-heading font-weight-bold">Parent Registration {status ? 'Complete' : '' }</h2>
                        {status ?
                        <span className="lead text-muted">You can now login to your account.</span>
                        : <span className="lead text-muted">Please provide all required details.</span>
                        }
                        
                        <div className="mt-4">
                            {status ? 
                            <StatusComponent />
                            : <ParentComponent 
                                setStatus={setStatus}
                                setIsProceed={setIsProceed}
                            />
                            }
                        </div>
                    </div>
                    }
            </div>
            }
       
     
{/* 
                <div class="d-flex align-items-center">
                    <div class="container text-center">
                     <div className={margin}>
                        {isProceed === false 
                        ? <div>
                            <h2 className="featurette-heading font-weight-bold">Registration</h2>
                            <div>
                                <Col>
                                    <Row>
                                        
                                    </Row>
                                    <Row className="mt-3">
                                        
                                    </Row>
                                </Col>
                            </div>
                        </div>
                        : <div>
                            
                        </div>
                        }
                    </div>
                    </div>
                </div> */}
            </Container>

                      
        </React.Fragment>
    )
}

export default RegisterComponent
