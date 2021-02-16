export const REGISTRATION_SET_FIELD = 'REGISTRATION_SET_FIELD'
export const REGISTRATION_SET_SHOW = 'REGISTRATION_SET_SHOW'
export const REGISTRATION_SET_LOADING = 'REGISTRATION_SET_LOADING'
export const REGISTRATION_SET_FORM_VALID = 'REGISTRATION_SET_FORM_VALID'
export const REGISTRATION_SET_DATA = 'REGISTRATION_SET_DATA'
export const REGISTRATION_POSITIONS = 'REGISTRATION_POSITIONS'
export const REGISTRATION_DEPARTMENTS = 'REGISTRATION_DEPARTMENTS'
export const REGISTRATION_SECTIONS = 'REGISTRATION_SECTIONS'

export const setField = (payload) => {
    return {
        type: REGISTRATION_SET_FIELD,
        payload: payload
    }
}

export const setShow = (payload) => {
    return {
        type: REGISTRATION_SET_SHOW,
        payload: payload
    }
}

export const setLoading = (payload) => {
    return {
        type: REGISTRATION_SET_LOADING,
        payload: payload
    }
}

export const setFormValid = (payload) => {
    return {
        type: REGISTRATION_SET_FORM_VALID,
        payload: payload
    }
}

export const setData = (payload) => {
    return {
        type: REGISTRATION_SET_DATA,
        payload: payload
    }
}

export const setPositions = (payload) => {
    return {
        type: REGISTRATION_POSITIONS,
        payload: payload
    }
}

export const setDepartments = (payload) => {
    return {
        type: REGISTRATION_DEPARTMENTS,
        payload: payload
    }
}

export const setSections = (payload) => {
    return {
        type: REGISTRATION_SECTIONS,
        payload: payload
    }
}