"use client"
import { setUser } from "../store/user/slice"
import axiosInstance from "./axiosInstance"

export const checkAuth =async(dispatch)=>{
try{
    const response =await axiosInstance.get("/users/me");
    if(response){
        dispatch(setUser(response.data));
        return response.data;
       
    }
}
catch(error){
    console.error("Auth check failed:", error);
    return null;
}
}