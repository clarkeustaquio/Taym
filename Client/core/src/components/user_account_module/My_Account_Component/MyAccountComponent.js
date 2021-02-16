import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'

import ChangeEmailComponent from './ChangeEmailComponent'
import ChangePasswordComponent from './ChangePasswordComponent'

import email from '../../../assets/user_account/email.png'

// import EmailSVG from './EmailSVG'

function MyAccountComponent() {
  const name = localStorage.getItem('first_name')
  React.useEffect(() => {
    document.title = name + ' | Account'
  })

  return (
    <React.Fragment>
        <Container>
            {/* <span className="text-muted lead">Change Email</span>
            <hr />
            <ChangeEmailComponent />
            <span className="text-muted lead mt-5">Change Password</span>
            <hr />
            <ChangePasswordComponent /> */}

              {/* <Container fluid className="h-100">
                    <div className="row featurette">
                        <div>
                          <span className="text-muted lead">Change Email</span>
                          <hr />
                            
                            <div className="mt-4">
                              <ChangeEmailComponent />
                            </div>
                        </div>
                        <div className="col-md-7 order-md-1">
                            <EmailSVG />
      
                        </div>
                    </div>
                </Container> */}

            <Card>
              <Card.Header className="bg-success" style={{
                    // backgroundColor: '#ea6b65',
                    // backgroundColor: '#d9534f',
                    backgroundColor: '#5cb85c',
                    // backgroundColor: '#d9534f',
                    color: 'white',
                    borderRadius: 0
                }}>Account Settings</Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <ChangeEmailComponent />
                  </Col>
                  <Col>
                  <ChangePasswordComponent />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
            {/* <Container>
              <Row>
                <Col>
                <EmailSVG />
                </Col>
                <Col>
                
                <span className="text-muted lead">Change Email</span>
                <ChangeEmailComponent />
                </Col>
              </Row>
            </Container> */}
                        
                  

        </Container>
    </React.Fragment>
  );
}

export default MyAccountComponent