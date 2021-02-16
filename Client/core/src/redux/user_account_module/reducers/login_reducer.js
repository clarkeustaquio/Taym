import { 
    LOGIN_SET_FIELD, 
    LOGIN_SET_ALERT, 
    LOGIN_SET_FORM_VALID, 
    LOGIN_SET_LOADING, 
    LOGIN_SET_PROMPT 
} from '../actions/login_action'

export const initialState = {
    email: '',
    password: '',
    set_prompt: '',
    isAlert: false,
    isLoading: false,
    validated_form: false,
    
}

export function LoginReducer(state=initialState, action){
    switch(action.type){
        case LOGIN_SET_FIELD:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case LOGIN_SET_ALERT:
            return {
                ...state,
                isAlert: action.payload
            }
        case LOGIN_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case LOGIN_SET_PROMPT:
            return {
                ...state,
                set_prompt: action.payload
            }
        case LOGIN_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        default:
            return state
    }
}
