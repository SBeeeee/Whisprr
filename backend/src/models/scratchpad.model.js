import mongoose from "mongoose";

const scratchpadSchema = new mongoose.Schema(
    {
      content: {
        type: mongoose.Schema.Types.Mixed,
        default: { blocks: [] },
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // IMPORTANT: one scratchpad per user
      },
    },
    { timestamps: true }
  );
  

export default mongoose.model("Scratchpad", scratchpadSchema);