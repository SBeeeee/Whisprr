import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/slice';
import todoReducer from  './todos/slice';
import reminderReducer from './reminders/slice';

export const store=configureStore({
    reducer:{
       user: userReducer,
       todos: todoReducer,
       reminders: reminderReducer,
    }
})

export default store;