import { createSlice } from "@reduxjs/toolkit";

const initialState={
    content:"",
    id:null,
}

const scratchpadSlice=createSlice({
    name:"scratchpad",
    initialState,
    reducers:{
        setContent:(state,action)=>{
            state.content=action.payload;
        },
        setId:(state,action)=>{
            state.id=action.payload;
        },
    }
});

export const{setContent,setId}=scratchpadSlice.actions;
export default scratchpadSlice.reducer;