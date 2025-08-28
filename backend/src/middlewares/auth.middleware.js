import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  // 1️⃣ Try cookie
  let token = req.cookies[process.env.COOKIE_NAME];

  // 2️⃣ If not in cookie, try Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  // 3️⃣ If still no token → Unauthorized
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
