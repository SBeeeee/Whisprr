import { createSlice } from "@reduxjs/toolkit";


const initialState={
    content:"",
    id:null,
    scratchloading:false,
    loadingType:null,
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
        setScratchLoading:(state,action)=>{
            state.scratchloading = action.payload.loading;
            state.loadingType = action.payload.type;
        }
    }
});

export const{setContent,setId,setScratchLoading}=scratchpadSlice.actions;
export default scratchpadSlice.reducer;