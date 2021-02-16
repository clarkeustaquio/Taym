import {
    CHANGE_PASSWORD_SET_ALERT,
    CHANGE_PASSWORD_SET_DATA,
    CHANGE_PASSWORD_SET_FIELD,
    CHANGE_PASSWORD_SET_FORM_VALID,
    CHANGE_PASSWORD_SET_LOADING,
    CHANGE_PASSWORD_SET_PROMPT,
    CHANGE_PASSWORD_SET_SHOW
} from '../actions/change_password_action'

export const initialState = {
    email: '',
    old_password: '',
    new_password: '',
    confirm_password: '',
    validated_form: false,
    isAlert: false,
    isLoading: false,
    isShow: false,
    set_prompt: '',
    data: {}
}

export function ChangePasswordReducer(state=initialState, action) {
    switch(action.type){
        case CHANGE_PASSWORD_SET_FIELD:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case CHANGE_PASSWORD_SET_ALERT:
            return {
                ...state,
                isAlert: action.payload
            }
        case CHANGE_PASSWORD_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case CHANGE_PASSWORD_SET_PROMPT:
            return {
                ...state,
                set_prompt: action.payload
            }
        case CHANGE_PASSWORD_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        case CHANGE_PASSWORD_SET_DATA:
            return {
                ...state,
                data: action.payload
            }
        case CHANGE_PASSWORD_SET_SHOW:
            return {
                ...state,
                isShow: action.payload
            }
        default:
            return state
    }
}