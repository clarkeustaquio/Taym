import React from 'react'
import { Container } from 'react-bootstrap';

// Components
import FormComponent from './FormComponent';

// Images
// import login from '../../../assets/common_module/login.png'
import workforce from '../../../assets/user_account/workforce.png'
import tracer from '../../../assets/user_account/login_main.png'
import exam from '../../../assets/user_account/exam.png'
import new_era from '../../../assets/user_account/new_era_logo.png'
import { ResponsiveContext } from '../../../App'

function LoginComponent(){
    const context = React.useContext(ResponsiveContext)
    const [isLoading, setLoading] = React.useState(false)

    let margin_top = "mt-5"
    let margin_login = "col-md-5 order-md-2 mt-5"

    if(context){
        margin_top = "mt-2"
        margin_login = "col-md-5 order-md-2"
    }

    React.useEffect(() => {
        document.title = 'Taym'
    }, [])

    return (
        <React.Fragment>
            <Container className={margin_top}>
                <Container fluid className="h-100">
                    <div className="row featurette">
                        <div className={margin_login}>
                            <h3 className="featurette-heading font-weight-bold">Welcome to Taym.</h3>
                            <span className="lead text-muted">Login to Continue.</span>
                            
                            <div className="mt-4">
                                <FormComponent isLoading={isLoading} setLoading={setLoading} />
                            </div>
                        </div>

                        <div className="col-md-7 order-md-1 text-center mt-4">
                            <img className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="350" height="400" src={new_era} alt="workforce"></img>
                        </div>
                    </div>
                </Container>
            </Container>
        </React.Fragment>
    )
}

export default LoginComponent