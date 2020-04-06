const initialState = {
    isAdmin: false
};

export const isAdmin = (state = initialState, action) => {
    switch (action.type) {
        case 'IS_ADMIN':
            let newState = Object.assign({}, state, {
                isAdmin: action.value
            })
            return newState;
        default:
            return state;
    }
}