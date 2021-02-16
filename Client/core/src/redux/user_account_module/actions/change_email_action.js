export const CHANGE_EMAIL_SET_FIELD = 'CHANGE_EMAIL_SET_FIELD'
export const CHANGE_EMAIL_SET_ALERT = 'CHANGE_EMAIL_SET_ALERT'
export const CHANGE_EMAIL_SET_LOADING = 'CHANGE_EMAIL_SET_LOADING'
export const CHANGE_EMAIL_SET_PROMPT = 'CHANGE_EMAIL_SET_PROMPT'
export const CHANGE_EMAIL_SET_FORM_VALID = 'CHANGE_EMAIL_SET_FORM_VALID'
export const CHANGE_EMAIL_SET_SHOW = 'CHANGE_EMAIL_SET_SHOW'

export const setField = (payload) => {
    return {
        type:  CHANGE_EMAIL_SET_FIELD,
        payload: payload
    }
}

export const setAlert = (payload) => {
    return {
        type:  CHANGE_EMAIL_SET_ALERT,
        payload: payload
    }
}

export const setLoading = (payload) => {
    return {
        type:  CHANGE_EMAIL_SET_LOADING,
        payload: payload
    }
}

export const setPrompt = (payload) => {
    return {
        type:  CHANGE_EMAIL_SET_PROMPT,
        payload: payload
    }
}

export const setFormValid = (payload) => {
    return {
        type:  CHANGE_EMAIL_SET_FORM_VALID,
        payload: payload
    }
}

export const setShow = (payload) => {
    return {
        type: CHANGE_EMAIL_SET_SHOW,
        payload: payload
    }
}