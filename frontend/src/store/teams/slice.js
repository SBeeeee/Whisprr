import {createSlice, current} from '@reduxjs/toolkit';


const initialState={
    teams:[],
    dashboardtasks:[],
    currentTeam:[],
    teamloading:false,
}

const teamSlice=createSlice({
    name:"teams",
    initialState,
    reducers:{
        setTeams:(state,action)=>{
            state.teams=action.payload;
        },
        setCurrentTeam:(state,action)=>{
            state.currentTeam=action.payload;
        },
        setDashboardTasks:(state,action)=>{
            state.dashboardtasks=action.payload;
        },
        setTeamLoading:(state,action)=>{
            state.teamloading=action.payload;
        }
    }
})

export const {setTeams,setCurrentTeam,setTeamLoading,setDashboardTasks}=teamSlice.actions;
export default teamSlice.reducer;