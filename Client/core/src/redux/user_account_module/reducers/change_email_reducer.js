import {
    CHANGE_EMAIL_SET_ALERT,
    CHANGE_EMAIL_SET_FIELD,
    CHANGE_EMAIL_SET_FORM_VALID,
    CHANGE_EMAIL_SET_LOADING,
    CHANGE_EMAIL_SET_PROMPT,
    CHANGE_EMAIL_SET_SHOW,
} from '../actions/change_email_action'

export const initialState = {
    email: '',
    isAlert: false,
    isLoading: false,
    isShow: false,
    set_prompt: '',
    validated_form: false,
}

export function ChangeEmailReducer(state=initialState, action){
    switch(action.type){
        case CHANGE_EMAIL_SET_FIELD:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case CHANGE_EMAIL_SET_SHOW:
            return {
                ...state,
                isShow: action.payload
            }
        case CHANGE_EMAIL_SET_ALERT:
            return {
                ...state,
                isAlert: action.payload
            }
        case CHANGE_EMAIL_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case CHANGE_EMAIL_SET_PROMPT:
            return {
                ...state,
                set_prompt: action.payload,
            }
        case CHANGE_EMAIL_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        default:
            return state
    }
}