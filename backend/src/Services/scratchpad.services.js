import Scratchpad from '../models/scratchpad.model.js'

export async function createScratchpad(data) {
  // Check if user already has a scratchpad
  const existingScratchpad = await Scratchpad.findOne({ createdBy: data.createdBy });
  
  if (existingScratchpad) {
      throw new Error("You already have a scratchpad. Only one scratchpad per user is allowed.");
  }
  
  return Scratchpad.create(data);
}
export async function getScratchPadcontent(userId){
    const content=await Scratchpad.findOne({createdBy:userId});
    if(!content){
        return {id:null,content:""};
    }
    return {
        id:content._id,
        content:content.content
    }
}


export async function UpdateScratchpad(id, content, userId) {
  try {
      // Check if the scratchpad exists and belongs to the user
      const scratchpad = await Scratchpad.findById(id);
      
      if (!scratchpad) {
          throw new Error("Scratchpad not found");
      }
      
      // Convert ObjectIds to strings for comparison
      if (scratchpad.createdBy.toString() !== userId.toString()) {
          throw new Error("Unauthorized: You can only update your own scratchpads");
      }
      
      // Update the scratchpad
      const updatedScratchpad = await Scratchpad.findByIdAndUpdate(
          id,
          { content },
          { new: true }
      );
      
      return {
          id: updatedScratchpad._id,
          content: updatedScratchpad.content,
      };
  } catch (error) {
      throw error; // Re-throw to be handled by controller
  }
}
