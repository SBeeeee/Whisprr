import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/slice';
import todoReducer from  './todos/slice';
import reminderReducer from './reminders/slice';
import scheduleReducer from './schedules/slice';
import scratchReducer from './scratchpad/slice';
import teamsReducer from './teams/slice';

export const store=configureStore({
    reducer:{
       user: userReducer,
       todos: todoReducer,
       reminders: reminderReducer,
       schedules: scheduleReducer,
       scratchpad: scratchReducer,
       teams: teamsReducer,
    }
})

export default store;