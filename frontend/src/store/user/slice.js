import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {},
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = {};
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;

export default userSlice.reducer;