const initialState = {
    userOpenOrder: false,
    itsNewUser: false,
};

export const userStatus = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_ORDER':
            let newState = Object.assign({}, state, {
                userOpenOrder: action.value
            })
            return newState;
        case 'NEW_USER':
            let newState1 = Object.assign({}, state, {
                itsNewUser: action.value
            })
            return newState1
        default:
            return state;
    }
}