import { Router } from "express";
import Mood from "../models/Mood.js";

const router = Router();

router.get("/", async (_req, res) => {
	const moods = await Mood.find().sort({ createdAt: -1 }).limit(30);
	res.json(moods);
});

router.post("/", async (req, res) => {
	try {
		const mood = await Mood.create(req.body);
		res.status(201).json(mood);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router;
