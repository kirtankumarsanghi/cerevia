import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		mood: { type: String, required: true, trim: true },
		note: { type: String, default: "" },
		score: { type: Number, min: 1, max: 10 }
	},
	{ timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
