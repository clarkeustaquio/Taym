import { 
    FORGOT_PASSWORD_SET_EMAIL,
    FORGOT_PASSWORD_SET_FORM_VALID, 
    FORGOT_PASSWORD_SET_LOADING, 
    FORGOT_PASSWORD_SET_SUCCESS,
    FORGOT_PASSWORD_SET_ALERT,
    FORGOT_PASSWORD_SET_PROMPT
} from '../actions/forgot_password_action'

export const initialState = {
    email: '',
    validated_form: false,
    isLoading: false,
    isSuccess: false,
    isAlert: false,
    set_prompt: '',
}

export function ForgotPasswordReducer(state=initialState, action){
    switch(action.type){
        case FORGOT_PASSWORD_SET_EMAIL:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case FORGOT_PASSWORD_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case FORGOT_PASSWORD_SET_SUCCESS:
            return {
                ...state,
                isSuccess: action.payload
            }
        case FORGOT_PASSWORD_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        case FORGOT_PASSWORD_SET_ALERT:
            return {
                ...state,
                isAlert: action.payload
            }
        case FORGOT_PASSWORD_SET_PROMPT:
            return {
                ...state,
                set_prompt: action.payload
            }
        default:
            return state
    }
}