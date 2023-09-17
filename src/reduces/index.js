import { combineReducers } from "redux";
import menu from './menu'
import user from './user'
import product from './product'

export default combineReducers({
    menu,
    user,
    product
})