export const initialState = {
    width: window.innerWidth,
    isMobile: false,
}

function ResponsiveReducer(state, action){
    switch(action.type){
        case 'CHANGE_SIZE':
            return {
                ...state,
                width: window.innerWidth,
            }
        case 'DESKTOP':
            return {
                ...state,
                isMobile: false,
            }
        case 'MOBILE':
            return {
                ...state,
                isMobile: true,
            }
        default:
            return state
    }
}

export default ResponsiveReducer