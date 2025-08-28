"use client"
import {useSelector,useDispatch} from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect,useState } from "react"
import { checkAuth } from "./checkAuth"

export default function PrivateRoute({children}){
    const {user} =useSelector((state)=>state.user);
    const dispatch =useDispatch();
    const router =useRouter();
    const [checking, setChecking] =useState(true);

    useEffect(()=>{
        const verifyAuth=async()=>{
            const token=localStorage.getItem("token");
            if (!token) {
                router.replace("/auth/login");
                return;
              }
              if (!user || Object.keys(user).length === 0) {
                const fetchedUser = await checkAuth(dispatch);
                if (!fetchedUser) {
                  alert("please login")
                  router.replace("/auth/login");
                  return;
                }
              }
              setChecking(false);
        }
        verifyAuth();
    },[]);

    if (checking) {
        return (
          <div className="flex justify-center items-center min-h-screen text-white">
            Checking authentication...
          </div>
        );
      }
    
      return children;
    }
