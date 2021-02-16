export const LOGIN_SET_FIELD = 'LOGIN_SET_FIELD'
export const LOGIN_SET_ALERT = 'LOGIN_SET_ALERT'
export const LOGIN_SET_LOADING = 'LOGIN_SET_LOADING'
export const LOGIN_SET_PROMPT = 'LOGIN_SET_PROMPT'
export const LOGIN_SET_FORM_VALID = 'LOGIN_SET_FORM_VALID'

export const setField = (payload) => {
    return {
        type: LOGIN_SET_FIELD,
        payload: payload
    }
}

export const setAlert = (payload) =>{
    return {
        type: LOGIN_SET_ALERT,
        payload: payload
    }
}

export const setLoading = (payload) =>{
    return {
        type: LOGIN_SET_LOADING,
        payload: payload
    }
}

export const setPrompt = (payload) =>{
    return {
        type: LOGIN_SET_PROMPT,
        payload: payload
    }
}

export const setFormValid = (payload) =>{
    return {
        type: LOGIN_SET_FORM_VALID,
        payload: payload
    }
}