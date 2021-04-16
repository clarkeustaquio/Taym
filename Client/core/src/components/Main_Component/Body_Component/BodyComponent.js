import React from 'react'
import { Button, Container } from 'react-bootstrap'

// import MyAccountComponent from '../user_account_module/My_Account_Component/MyAccountComponent';
import NavbarComponent from '../Navbar_Component/NavbarComponent'
import MyAccountComponent from '../../user_account_module/My_Account_Component/MyAccountComponent'
import HomeComponent from './HomeComponent'
import SubjectComponent from '../Subject_Component/SubjectComponent'
import HistoryComponent from '../History_Component/HistoryComponent'
import ParentRequestComponent from './ParentRequestComponent'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';


function BodyComponent({ handleLogout }){
    let { path, url } = useRouteMatch();
    return (
        <React.Fragment>
            <NavbarComponent url={url} handleLogout={handleLogout} />
            <Container className="mt-4">
                <Route exact path={`${path}`}>
                    <HomeComponent />
                </Route>

                <Route path={`${path}/subject`}>
                    <SubjectComponent />
                </Route>

                <Route path={`${path}/history`}>
                    <HistoryComponent />
                </Route>

                <Route path={`${path}/parent`}>
                    <ParentRequestComponent />
                </Route>


                <Route path={`${path}/settings`}>
                    <MyAccountComponent />
                </Route>
            </Container>
            
        </React.Fragment>
    )
}

export default BodyComponent