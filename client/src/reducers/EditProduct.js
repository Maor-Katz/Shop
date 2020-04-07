const initialState = {
    productId: 0
};

export const editProduct = (state = initialState, action) => {
    switch (action.type) {
        case 'EDIT_PRODUCT':
            let newState = Object.assign({}, state, {
                productId: action.value
            })
            return newState;
        default:
            return state;
    }
}