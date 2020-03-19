import { combineReducers } from 'redux'
import { newUser } from './newUser';
import { existingUser } from './existingUser';
import { shoppingCart } from './shoppingCart';


export const allReducers = combineReducers({
    newUser,
    existingUser,
    shoppingCart
});
