import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true, trim: true },
		completed: { type: Boolean, default: false },
		category: { type: String, default: "mindfulness" }
	},
	{ timestamps: true }
);

export default mongoose.model("Task", taskSchema);
