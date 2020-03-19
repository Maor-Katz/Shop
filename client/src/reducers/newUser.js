const initialState = {
    firstname: '',
    lastname: '',
    email: '',
    id: '',
    city: '',
    street: '',
    password: '',
    confirm_password: '',
    role: ''
};

export const newUser = (state = initialState, action) => {
    switch (action.type) {
        case 'FIRSTNAME':
            let newState = Object.assign({}, state, {
                firstname: action.value
            })
            return newState;
        case 'LASTNAME':
            let newState1 = Object.assign({}, state, {
                lastname: action.value
            })
            return newState1
        case 'EMAIL':
            let newState2 = Object.assign({}, state, {
                email: action.value
            })
            return newState2
        case 'ID':
            let newState3 = Object.assign({}, state, {
                id: action.value
            })
            return newState3
        case 'CITY':
            let newState4 = Object.assign({}, state, {
                city: action.value
            })
            return newState4
        case 'STREET':
            let newState5 = Object.assign({}, state, {
                street: action.value
            })
            return newState5
        case 'ROLE':
            let newState6 = Object.assign({}, state, {
                role: action.value
            })
            return newState6
        case 'PASSWORD':
            let newState7 = Object.assign({}, state, {
                password: action.value
            })
            return newState7
        case 'CONFIRM_PASSWORD':
            let newState8 = Object.assign({}, state, {
                confirm_password: action.value
            })
            return newState8
        default:
            return state;
    }
}