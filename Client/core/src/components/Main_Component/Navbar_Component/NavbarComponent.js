import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import LogoComponent from './LogoComponent'

// CSS
import './NavbarComponent.css'

function NavbarComponent({ url, handleLogout }){
    return (
        <React.Fragment>
            <Navbar className="navbar-color shadow-sm" sticky="top" expand='lg'>
                <Container>
                <Navbar.Brand as={Link} to='/login'><LogoComponent /></Navbar.Brand>
                <Navbar.Toggle aria-controls='toggle-navbar' />
                <Navbar.Collapse id='toggle-navbar'>
                    {/* <Nav className='ml-auto mr-5'>
                        <Nav.Link as={Link} to='/my-account'>Account</Nav.Link>
                    </Nav> */}
                    <Nav className='ml-auto mr-5' >
                        <NavDropdown title="Account" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={`${url}/settings`}>Settings</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    )
}

export default NavbarComponent