"use client"
import { useEffect } from "react";
import Scratchpad from "./Scratchpad";
import { useDispatch } from "react-redux";
import {setId,setContent} from "@/store/scratchpad/slice";
import { getscratch } from "../api/scratchpad.api";

export default function ScratchView() {
const dispatch=useDispatch();
const fetchScratch=async()=>{
  try{
    const res=await getscratch();
    dispatch(setContent(res.data?.content));  
    dispatch(setId(res.data?.id));
    }
    catch(error){
      console.error("❌ Error fetching scratchpad:", error);
      dispatch(setContent(""));
      dispatch(setId(null));
    }
  }
  useEffect(()=>{
    fetchScratch();
  },[]);

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Scratchpad</h2>
        <p className="text-gray-600">A space for your quick thoughts, ideas, and notes.</p>
      </div>
      <Scratchpad />
    </div>
  );
}