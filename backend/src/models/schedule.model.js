import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    start:Date,
    end:Date,
    labels:[String],
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
      },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    }, { timestamps: true });

export default mongoose.model("Schedule", scheduleSchema);