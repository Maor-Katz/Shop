let initialState = {

}

export const userDetails = (state = initialState, action) => {
    switch (action.type) {
        case 'DETAILS':
            let newState = Object.assign({}, state, action.value)
            return newState;
        default:
            return state;
    }
}