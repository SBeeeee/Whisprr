import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/slice';
import todoReducer from  './todos/slice';

export const store=configureStore({
    reducer:{
       user: userReducer,
       todos: todoReducer,
    }
})

export default store;