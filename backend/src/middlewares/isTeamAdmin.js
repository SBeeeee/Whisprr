export const isTeamAdmin = (req, res, next) => {
    if (req.teamRole !== "admin")
      return res.status(403).json({ message: "Admin access required" });
  
    next();
  };
  