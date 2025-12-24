import { CreateTeam,Addmember,GetTeamById,GetAllTeamsForUser,getTeamsDashboard,GetTeamTasks } from "../Services/team.services.js";

export const createTeamController = async (req, res) => {
    try {
      const team = await CreateTeam({
        name: req.body.name,
        description: req.body.description,
        createdBy: req.id,
        members: [
          {
            user: req.id,
            role: "admin"
          }
        ]
      });
  
      res.status(201).json({ success: true, team });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const addMemberController = async (req, res) => {
    try {
      const { teamId } = req.params;
      const { memberId, role } = req.body;
  
      const team = await Addmember(teamId, memberId, role);
  
      res.json({ success: true, team });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getTeamByIdController = async (req, res) => {
    try {
      const team = await GetTeamById(req.params.teamId);
  
      if (!team) {
        return res.status(404).json({ success: false, message: "Team not found" });
      }
  
      res.json({ success: true, team });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getUserTeamsController = async (req, res) => {
    try {
      const teams = await GetAllTeamsForUser(req.id);
      res.json({ success: true, teams });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getTeamsDashboardController = async (req, res) => {
    try {
      const dashboard = await getTeamsDashboard(
        req.id,
        req.query // filters come from query params
      );
  
      res.json({
        success: true,
        teams: dashboard.teams,
        myTasks: dashboard.myTasks
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  export const getTeamTasksController = async (req, res) => {
    try {
      const { teamId } = req.params;
  
      const tasks = await GetTeamTasks(teamId, req.query);
  
      res.json({ success: true, tasks });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  