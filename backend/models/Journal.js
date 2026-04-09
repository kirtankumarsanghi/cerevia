import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		title: { type: String, default: "Daily Reflection" },
		content: { type: String, required: true },
		tags: [{ type: String }]
	},
	{ timestamps: true }
);

export default mongoose.model("Journal", journalSchema);
