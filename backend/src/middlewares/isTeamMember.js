import Team from "../models/Team.models.js";

export const isTeamMember = async (req, res, next) => {
    const teamId = req.params.teamId
  
    if (!teamId) return next(); // personal task
  
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
  
    const member = team.members.find(m => m.user.equals(req.id));
    if (!member)
      return res.status(403).json({ message: "Not a team member" });
  
    req.team = team;
    req.teamRole = member.role;
    next();
  };
  