import { Router } from "express";
import mongoose from "mongoose";
import Mood from "../models/Mood.js";

const router = Router();

function requireUserId(req, res) {
	const userId = req.headers["x-user-id"];
	if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
		res.status(401).json({ message: "Unauthorized" });
		return null;
	}
	return userId;
}

router.get("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const moods = await Mood.find({ userId }).sort({ createdAt: -1 }).limit(30);
		res.json(moods);
	} catch (error) {
		res.status(500).json({ message: error.message || "Could not load moods" });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const moodValue = String(req.body.mood || "").trim();
		if (!moodValue) {
			return res.status(400).json({ message: "Mood is required" });
		}

		const note = typeof req.body.note === "string" ? req.body.note.trim() : "";
		const score = typeof req.body.score === "number" ? req.body.score : undefined;

		const mood = await Mood.create({ mood: moodValue, note, score, userId });
		res.status(201).json(mood);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router;
