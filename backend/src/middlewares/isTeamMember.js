// Add this import at the top of your isTeamMember middleware file
import Team from "../models/Team.models.js";
export const isTeamMember = async (req, res, next) => {
  const teamId = req.params.teamId || req.body.team || req.query.team;
  
  if (!teamId) return next(); // personal task or no team context
  
  try {
    const team = await Team.findById(teamId);
    
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    
    const member = team.members.find(m => m.user.equals(req.id));
    
    if (!member) {
      return res.status(403).json({ message: "Not a team member" });
    }
    
    req.team = team;
    req.teamRole = member.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};