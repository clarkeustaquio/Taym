export const RESET_PASSWORD_SET_FIELD = 'RESET_PASSWORD_SET_FIELD'
export const RESET_PASSWORD_SET_LOADING = 'RESET_PASSWORD_SET_LOADING'
export const RESET_PASSWORD_SET_SHOW = 'RESET_PASSWORD_SET_SHOW'
export const RESET_PASSWORD_SET_FORM_VALID = 'RESET_PASSWORD_SET_FORM_VALID'
export const RESET_PASSWORD_SET_STATUS = 'RESET_PASSWORD_SET_STATUS'
export const RESET_PASSWORD_SET_DATA = 'RESET_PASSWORD_SET_DATA'

export const setField = (payload) => {
    return {
        type: RESET_PASSWORD_SET_FIELD,
        payload: payload
    }
}

export const setLoading = (payload) => {
    return {
        type: RESET_PASSWORD_SET_LOADING,
        payload: payload
    }
}

export const setShow = (payload) => {
    return {
        type: RESET_PASSWORD_SET_SHOW,
        payload: payload
    }
}

export const setFormValid = (payload) => {
    return {
        type: RESET_PASSWORD_SET_FORM_VALID,
        payload: payload
    }
}

export const setStatus = (payload) => {
    return {
        type: RESET_PASSWORD_SET_STATUS,
        payload: payload
    }
}

export const setData = (payload) => {
    return {
        type: RESET_PASSWORD_SET_DATA,
        payload: payload
    }
}