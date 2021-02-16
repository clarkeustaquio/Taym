export const FORGOT_PASSWORD_SET_EMAIL = 'FORGOT_PASSWORD_SET_EMAIL'
export const FORGOT_PASSWORD_SET_LOADING = 'FORGOT_PASSWORD_SET_LOADING'
export const FORGOT_PASSWORD_SET_SUCCESS = 'FORGOT_PASSWORD_SET_SUCCESS'
export const FORGOT_PASSWORD_SET_FORM_VALID = 'FORGOT_PASSWORD_SET_FORM_VALID'
export const FORGOT_PASSWORD_SET_PROMPT = 'FORGOT_PASSWORD_SET_PROMPT'
export const FORGOT_PASSWORD_SET_ALERT = 'FORGOT_PASSWORD_SET_ALERT'

export const setEmail = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_EMAIL,
        payload: payload
    }
}

export const setLoading = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_LOADING,
        payload: payload
    }
}

export const setSuccess = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_SUCCESS,
        payload: payload
    }
}

export const setFormValid = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_FORM_VALID,
        payload: payload
    }
}

export const setAlert = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_ALERT,
        payload: payload
    }
}

export const setPrompt = (payload) => {
    return {
        type: FORGOT_PASSWORD_SET_PROMPT,
        payload: payload
    }
}