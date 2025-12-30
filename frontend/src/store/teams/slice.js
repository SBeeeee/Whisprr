import {createSlice, current} from '@reduxjs/toolkit';


const initialState={
    teams:[],
    dashboardtasks:[],
    currentTeamId:null,
    teamloading:false,
}

const teamSlice=createSlice({
    name:"teams",
    initialState,
    reducers:{
        setTeams:(state,action)=>{
            state.teams=action.payload;
        },
        setCurrentTeamId:(state,action)=>{
            state.currentTeamId=action.payload;
        },
        setDashboardTasks:(state,action)=>{
            state.dashboardtasks=action.payload;
        },
        setTeamLoading:(state,action)=>{
            state.teamloading=action.payload;
        }
    }
})

export const {setTeams,setCurrentTeamId,setTeamLoading,setDashboardTasks}=teamSlice.actions;
export default teamSlice.reducer;