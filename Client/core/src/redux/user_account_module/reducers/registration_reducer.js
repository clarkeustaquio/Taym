import {
    REGISTRATION_SET_DATA,
    REGISTRATION_SET_FIELD,
    REGISTRATION_SET_FORM_VALID,
    REGISTRATION_SET_LOADING,
    REGISTRATION_SET_SHOW,
    REGISTRATION_POSITIONS,
    REGISTRATION_DEPARTMENTS,
    REGISTRATION_SECTIONS
} from '../actions/registration_action'

export const initialState = {
    email: '',
    employee_no: '',
    username: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    department: '',
    section: '',
    country: 'Philippines',
    password: '',
    confirm_password: '',
    isShow: false,
    isLoading: false,
    validated_form: false,
    data: {},
    positions: [],
    departments: [],
    sections: [],
    position: '',
}

export function RegistrationReducer(state=initialState, action){
    switch(action.type){
        case REGISTRATION_SET_FIELD:
            const new_state = {...state}
            new_state[action.payload.name] = action.payload.value
            return new_state
        case REGISTRATION_SET_SHOW:
            return {
                ...state,
                isShow: action.payload
            }
        case REGISTRATION_SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case REGISTRATION_SET_FORM_VALID:
            return {
                ...state,
                validated_form: action.payload
            }
        case REGISTRATION_SET_DATA:
            return {
                ...state,
                data: action.payload
            }
        case REGISTRATION_POSITIONS:
            return {
                ...state,
                positions: action.payload
            }
        case REGISTRATION_DEPARTMENTS:
            return {
                ...state,
                departments: action.payload
            }
        case REGISTRATION_SECTIONS:
            return {
                ...state,
                sections: action.payload
            }
        default:
            return state
    }
}