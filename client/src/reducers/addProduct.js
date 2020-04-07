const initialState = {
    name: '',
    price: 0,
    category_id: 0,
    files: {},
    img_name: ''
};

export const newProduct = (state = initialState, action) => {
    switch (action.type) {
        case 'NAME_P':
            let newState = Object.assign({}, state, {
                name: action.value
            })
            return newState;
        case 'PRICE_P':
            let newState1 = Object.assign({}, state, {
                price: action.value
            })
            return newState1

        case 'CATEGORY_ID':
            let newState3 = Object.assign({}, state, {
                category_id: action.value
            })
            return newState3
        case 'UPLOAD_IMAGE':
            let newState4 = Object.assign({}, state, {
                files: action.value
            })
            return newState4
        case 'IMAGE_NAME':
            let newState5 = Object.assign({}, state, {
                img_name: action.value
            })
            return newState5
        default:
            return state;
    }
}