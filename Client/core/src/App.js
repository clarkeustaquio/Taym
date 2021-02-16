import React from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

// Helper Components
import LoginHelper from './components/_helper/login_helper'
import RegisterHelper from './components/_helper/register_helper'
import ForgotPasswordHelper from './components/_helper/forgot_password_helper'
import ResetPasswordHelper from './components/_helper/reset_password_helper'
import ChangePasswordHelper from './components/_helper/change_password_helper'
import ActivatedHelper from './components/_helper/activated_helper'

import MainHelper from './components/main'

// Reducer
import ResponsiveReducer, {initialState} from './react_reducers/responsive_reducer'

import FloatingButtonComponent from './components/user_account_module/Floating_Button_Component/FloatingButtonComponent'

export const ResponsiveContext = React.createContext()

function App() {
  const [state, dispatch] = React.useReducer(ResponsiveReducer, initialState)

  const changeSize = () => {
    dispatch({type: 'CHANGE_SIZE'})
  }

  React.useEffect(() => {
    window.addEventListener('resize', changeSize)

    if (state.width < 576) {
      dispatch({type: 'MOBILE'})
    } else {
      dispatch({type: 'DESKTOP'})
    }

    return () => {
      window.removeEventListener('resize', changeSize)
    }

  }, [state.isMobile, state.width])
  
  React.useEffect(() => {
    document.title = 'KMLNGMLKS Corp.'
  })
  return (
    <React.Fragment> 
      <ResponsiveContext.Provider value={state.isMobile}>
        <Router>
          <Switch>
            <Route exact path='/'>
              <Redirect to='/login' />
            </Route>

            <Route path='/home'>
              <MainHelper />
            </Route>

            <Route path='/login'>
              <LoginHelper />
            </Route>

            <Route path='/register'>
              <RegisterHelper />
            </Route>

            <Route path='/forgot-password'>
              <ForgotPasswordHelper />
            </Route>

            <Route path='/reset-password/:email/:token'>
              <ResetPasswordHelper />
            </Route>

            <Route path='/change-password'>
              <ChangePasswordHelper />
            </Route>

            <Route path='/account-activated/:uid/:token'>
              <ActivatedHelper />
            </Route>

            <Route path="*">
              <Redirect to='/login' />
            </Route>
          </Switch>
          {/* <FloatingButtonComponent /> */}
        </Router>
      </ResponsiveContext.Provider>
    </React.Fragment>
  )
}

export default App;