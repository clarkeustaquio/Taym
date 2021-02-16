import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import LogoComponent from './LogoComponent'

// CSS
import './NavbarComponent.css'

function NavbarComponent(){
    return (
        <React.Fragment>
            <Navbar className="navbar-color shadow-sm" sticky="top" expand='lg'>
                <Container>
                <Navbar.Brand as={Link} to='/login'><LogoComponent /></Navbar.Brand>
                <Navbar.Toggle aria-controls='toggle-navbar' />
                <Navbar.Collapse id='toggle-navbar'>
                    <Nav className='ml-auto mr-5'>
                        <Nav.Link as={Link} to='/register'>Register</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    )
}

export default NavbarComponent