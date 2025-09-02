import { createSlice } from "@reduxjs/toolkit";

const initialState={
    schedule:[],
};

const schedulesSlice=createSlice({
    name:"schedules",
    initialState,
    reducers:{
        setSchedules:(state,action)=>{
            state.schedule=action.payload;
        },
    },
});

export const {setSchedules}=schedulesSlice.actions;
export default schedulesSlice.reducer;