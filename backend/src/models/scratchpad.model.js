import mongoose from "mongoose";

const scratchpadSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps: true});

export default mongoose.model("Scratchpad", scratchpadSchema);