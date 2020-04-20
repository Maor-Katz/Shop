const initialState = {
    loginPage: true,
    aboutPage: true,
    infoPage: true,
    mobileMenu: false
};

export const view = (state = initialState, action) => {
    switch (action.type) {
        case 'INFO_PAGE':
            let newState = Object.assign({}, state, {
                infoPage: action.value
            })
            return newState
        case 'ABOUT_PAGE':
            let newState1 = Object.assign({}, state, {
                aboutPage: action.value
            })
            return newState1
        case 'LOGIN_PAGE':
            let newState2 = Object.assign({}, state, {
                loginPage: action.value
            })
            return newState2
        case 'MOBILE_MENU':
            let newState3 = Object.assign({}, state, {
                mobileMenu: action.value
            })
            return newState3
        default:
            return state;
    }
}