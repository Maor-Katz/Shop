const initialState = {
    shopping_cart: false
};

export const shoppingCart = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOPPING_CART':
            let newState = Object.assign({}, state, {
                shopping_cart: action.value
            })
            return newState;
        default:
            return state;
    }
}