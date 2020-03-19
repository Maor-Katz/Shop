const initialState = {
    email: '',
    password: '',
};

export const existingUser = (state = initialState, action) => {

    switch (action.type) {
        case 'EMAIL':
            let newState2 = Object.assign({}, state, {
                email: action.value
            })
            return newState2
        case 'PASSWORD':
            let newState7 = Object.assign({}, state, {
                password: action.value
            })
            return newState7
        default:
            return state;
    }
}