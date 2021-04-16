import React from 'react'

function WaveComponent(){
    return (
        <React.Fragment>
                {/* <footer className="mt-auto container-fluid">
                    <div className="container text-center text-md-left">
                        <div className="row mt-3">
                            
                            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4 text-white mt-5">
                                <h6 className="text-uppercase font-weight-bold">Cinema</h6>
                                <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: 60}} />
                                <p>Enjoy the latest international & local films with your family & friends at Cinema!</p>
                            </div>

                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 text-white mt-5">
                                <h6 className="text-uppercase font-weight-bold">Contact</h6>
                                <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: 60}} />
                                <p className="text-white">+63123123123</p>
                                <p className="text-white">cinema@cinema.com</p>
                            </div>
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4 text-white mt-5">
                                <h6 className="text-uppercase font-weight-bold">Developers</h6>
                                <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{width: 60}} />
                                <p><a className="text-white" href="{% url 'api:movie_api' %}">Movies API</a></p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="text-center mb-4">© 2021 Copyright:
                        <a className="text-white" href="#"> Taym</a>
                    </div>
                </footer> */}
            <div className="mt-auto">
                <svg viewBox="0 0 1440 320">
                    <path fill="#5cb85c" 
                        fillOpacity="1" 
                        d="M0,0L40,16C80,32,160,64,240,90.7C320,117,400,139,480,133.3C560,128,640,96,720,85.3C800,75,880,85,960,96C1040,107,1120,117,1200,112C1280,107,1360,85,1400,74.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">  
                    </path>
                </svg>
            </div>
        </React.Fragment>
    )
}

export default WaveComponent