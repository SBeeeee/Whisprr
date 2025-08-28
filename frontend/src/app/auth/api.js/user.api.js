import axiosInstance from "@/utils/axiosInstance";

export const loginUser = async({ username, password }) => { // ✅ Fixed parameter structure
    try {
        const {data} = await axiosInstance.post("/users/login", {username, password});
        return data;
    } catch (error) {
        console.log(error);
        throw error; // ✅ Throw error instead of returning null so frontend can catch it
    }
}

export const registerUser = async({ username, password, phone }) => { // ✅ Fixed parameter structure
    try { 
        const {data} = await axiosInstance.post("/users/register", {username, password, phone}); // ✅ Fixed endpoint to match
        return data;
    } catch(error) {
        console.log(error);
        throw error; // ✅ Throw error instead of returning null
    }
}

export const logoutUser = async () => {
    try {
        await axiosInstance.get("/users/logout"); // ✅ Fixed endpoint to match (users not user)
        localStorage.removeItem('token');
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}