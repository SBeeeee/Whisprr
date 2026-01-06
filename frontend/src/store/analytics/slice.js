import { createSlice } from '@reduxjs/toolkit';

const initialState={
    analyticsData: {
        pendingEvents: 0,
        pendingEventsToday: 0,
        todaysDoneEvents: 0,
        overdueEvents: 0,
    },
}

const analyticsSlice=createSlice({
    name:'analytics',
    initialState,
    reducers:{
        setAnalyticsData:(state,action)=>{
            state.analyticsData=action.payload;
        },
    },
});

export const {setAnalyticsData}=analyticsSlice.actions;

export default analyticsSlice.reducer;