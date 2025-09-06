import { createScratchpad,getScratchPadcontent,UpdateScratchpad } from "../Services/scratchpad.services.js";

export const createController =async(req,res)=>{
    try{
        const data={...req.body,createdBy:req.id};
        const scratchpad=await createScratchpad(data);
        res.status(201).json({
            success:true,
            data:scratchpad,
        })
    }
    catch(error){
        if (error.message.includes("already have a scratchpad")) {
            return res.status(409).json({
                success: false,
                error: error.message,
            });
        }
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const getUserScratchPadcontroller=async(req,res)=>{
    try{
        const scratchpad=await getScratchPadcontent(req.id);
        res.status(200).json({
            success:true,
            data:scratchpad,
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
        })
    }
}

export const updatescratchpadController = async (req, res) => {
    try {
        const { id, content } = req.body;
        
        // Validate required fields
        if (!id || content === undefined) {
            return res.status(400).json({
                success: false,
                error: "ID and content are required"
            });
        }
        
        const scratchpad = await UpdateScratchpad(id, content, req.id);
        
        res.status(200).json({
            success: true,
            data: scratchpad,
        });
    } catch (error) {
        
        if (error.message === "Scratchpad not found") {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        
        if (error.message.includes("Unauthorized")) {
            return res.status(403).json({
                success: false,
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}