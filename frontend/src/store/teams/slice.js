import { createSlice, current } from '@reduxjs/toolkit';
import { set } from 'date-fns';


const initialState = {
    teams: [],
    dashboardtasks: [],
    currentTeam: [],
    teamTasks: [],
    teamloading: false,
    teamTasksLoading: false,
    teamTasksPagination: {
        page: 1,
        limit: 5,
        total: 0,
        totalPages: 1
    },
    teamTasksFilters: {
        status: "",
        priority: "",
        q: ""
    },
    kanbantasks:[],
    kanbanLoading: false
};


const teamSlice = createSlice({
    name: "teams",
    initialState,
    reducers: {
        setTeams: (state, action) => {
            state.teams = action.payload;
        },
        setCurrentTeam: (state, action) => {
            state.currentTeam = action.payload;
        },
        setDashboardTasks: (state, action) => {
            state.dashboardtasks = action.payload;
        },
        setTeamLoading: (state, action) => {
            state.teamloading = action.payload;
        },
        setTeamTasks(state, action) {
            state.teamTasks = action.payload.tasks;
            state.teamTasksPagination = action.payload.pagination;
        },

        setTeamTasksLoading(state, action) {
            state.teamTasksLoading = action.payload;
        },

        setTeamTasksFilters(state, action) {
            state.teamTasksFilters = {
                ...state.teamTasksFilters,
                ...action.payload
            };
            state.teamTasksPagination.page = 1;
        },

        setTeamTasksPage(state, action) {
            state.teamTasksPagination.page = action.payload;
        },
        setKanbanTasks(state, action) {
            state.kanbantasks = action.payload;
        },
        setKanbanLoading(state, action) {   
            state.kanbanLoading = action.payload;
        }
    }
})

export const { setTeams, setCurrentTeam, setTeamLoading, setDashboardTasks, setTeamTasks,
    setTeamTasksLoading,
    setTeamTasksFilters,
    setTeamTasksPage,setKanbanLoading,setKanbanTasks } = teamSlice.actions;
export default teamSlice.reducer;