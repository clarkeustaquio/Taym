import { applyMiddleware, createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

// Common Module
import { LoginReducer } from './user_account_module/reducers/login_reducer'
import { ForgotPasswordReducer } from './user_account_module/reducers/forgot_password_reducer'
import { ResetPasswordReducer } from './user_account_module/reducers/reset_password_reducer'
import { RegistrationReducer } from './user_account_module/reducers/registration_reducer'
import { ChangePasswordReducer } from './user_account_module/reducers/change_password_reducer'
import { ChangeEmailReducer } from './user_account_module/reducers/change_email_reducer'

const middleware = [thunk]
const reducer = combineReducers({
    LoginReducer,
    ForgotPasswordReducer,
    ResetPasswordReducer,
    RegistrationReducer,
    ChangePasswordReducer,
    ChangeEmailReducer,
})

const initialState = {}
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store