import React from 'react'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import LogoComponent from './LogoComponent'

// CSS
import './NavbarComponent.css'

function NavbarComponent({ url, handleLogout }){
    const is_admin = localStorage.getItem('is_admin')
    const name = localStorage.getItem('last_name') + ', ' + localStorage.getItem('first_name')
    const is_parent = localStorage.getItem('is_parent')
    return (
        <React.Fragment>
            <Navbar className="navbar-color shadow-sm" sticky="top" expand='lg'>
                <Container>
                <Navbar.Brand as={Link} to='/login'><LogoComponent /></Navbar.Brand>
                <Navbar.Toggle aria-controls='toggle-navbar' />
                
                <Navbar.Collapse id='toggle-navbar'>
                    <Nav>
                        {is_parent === 'true' ? null 
                        : <React.Fragment>
                            <Nav.Link as={Link} to={`${url}/subject`}>Subjects</Nav.Link>
                            <Nav.Link as={Link} to={`${url}/history`}>History</Nav.Link>
                            {is_admin === 'true' ? null 
                            : <Nav.Link as={Link} to={`${url}/parent`}>Parent</Nav.Link>
                            }
                            
                        </React.Fragment>
                        }
                        
                    </Nav>
                    <Nav className='ml-auto'>
                        <NavDropdown title={name + ' '} id="basic-nav-dropdown">
                            {/* <NavDropdown.Item as={Link} to={`${url}/settings`}>Settings</NavDropdown.Item>
                            <NavDropdown.Divider /> */}
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