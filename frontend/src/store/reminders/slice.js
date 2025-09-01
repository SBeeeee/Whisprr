import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reminders: [],
};

const RemindersSlice = createSlice({
  name: 'reminders',
  initialState,
  reducers: {
    setReminders: (state, action) => {
      state.reminders = action.payload;
    },
  },
});

export const {
  setReminders,
} = RemindersSlice.actions;

export default RemindersSlice.reducer;

