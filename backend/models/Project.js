// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // Who created the board (either a freelancer or client)
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Users involved in the board
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Optional: status, due dates, progress
    status: {
      type: String,
      enum: ["active", "completed", "on-hold"],
      default: "active",
    },
    dueDate: Date,
    progress: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
