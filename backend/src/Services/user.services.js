import User from "../models/Users.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async ({ username, password, phone }) => {
    const existing = await User.findOne({ username });
    if (existing) throw new Error("Username already taken");
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = new User({
      username,
      password: hashedPassword,
      phone,
    });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "3d",
    });
  
    await user.save();
    return {user,token};
  };


  export const loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Invalid username or password");
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid username or password");
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "3d",
    });
  
    return { user, token };
  };
  
  export const getUserById = async (id) => {
    return await User.findById(id).select("-password");
  };