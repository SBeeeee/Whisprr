import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.id = decoded.id;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
  };