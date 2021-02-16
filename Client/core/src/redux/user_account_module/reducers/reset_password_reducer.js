import {
    RESET_PASSWORD_SET_DATA,
    RESET_PASSWORD_SET_FIELD,
    RESET_PASSWORD_SET_FORM_VALID,
    RESET_PASSWORD_SET_LOADING,
    RESET_PASSWORD_SET_SHOW,
    RESET_PASSWORD_SET_STATUS
} from '../actions/reset_password_reducer'

export const initialState = {
    new_password: '',
    confirm_password: '',
    isLoading: false,
    validated_form: false,
    isShow: false,
    status: false,
    data: {},
}

export function ResetPasswordReducer(state=initialState, action){
    switch(action.type){
        case RESET_PASSWORD_SET_FIELD:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case RESET_PASSWORD_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case RESET_PASSWORD_SET_SHOW:
            return {
                ...state,
                isShow: action.payload
            }
        case RESET_PASSWORD_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        case RESET_PASSWORD_SET_STATUS:
            return {
                ...state,
                status: action.payload
            }
        case RESET_PASSWORD_SET_DATA:
            return {
                ...state,
                data: action.payload
            }
        default:
            return state
    }
} 