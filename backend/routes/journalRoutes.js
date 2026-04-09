import { Router } from "express";
import Journal from "../models/Journal.js";

const router = Router();

router.get("/", async (_req, res) => {
	const entries = await Journal.find().sort({ createdAt: -1 }).limit(50);
	res.json(entries);
});

router.post("/", async (req, res) => {
	try {
		const entry = await Journal.create(req.body);
		res.status(201).json(entry);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

export default router;
