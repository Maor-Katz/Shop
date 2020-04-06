import { combineReducers } from 'redux'
import { newUser } from './newUser';
import { existingUser } from './existingUser';
import { shoppingCart } from './shoppingCart';
import { userDetails } from './userdetails';
import { isAdmin } from './isAdmin';
import { newProduct } from './addProduct';


export const allReducers = combineReducers({
    newUser,
    existingUser,
    shoppingCart,
    userDetails,
    isAdmin,
    newProduct
});
