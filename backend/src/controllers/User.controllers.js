import { registerUser, loginUser, getUserById,gettimer,settimer,getAllUser } from "../Services/user.services.js";

export const register = async (req, res) => {
    try {
        const {user,token} = await registerUser(req.body);
        res.status(201).json({ message: "User registered", user,token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { user, token } = await loginUser(req.body);

        res
            .cookie(process.env.COOKIE_NAME, token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // set true in prod
                sameSite: "strict",
                maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            })
            .status(200)
            .json({ message: "Login successful", user,token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
};

export const logout = (req, res) => {
    res
        .clearCookie(process.env.COOKIE_NAME)
        .status(200)
        .json({ message: "Logged out successfully" });
};

export const settimercontroller = async (req,res) => {
    try {
        const {time} = req.body;
        const id = req.id;
        const user = await settimer({id,time});
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}


export const gettimercontroller = async (req,res) => {
    try {
        const id = req.id;
        const timer = await gettimer({id});
        res.status(200).json({timer});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUser();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
