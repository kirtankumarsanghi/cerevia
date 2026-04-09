import { Router } from "express";
import mongoose from "mongoose";
import Journal from "../models/Journal.js";

const router = Router();

function requireUserId(req, res) {
	const userId = req.headers["x-user-id"];
	if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
		res.status(401).json({ message: "Unauthorized" });
		return null;
	}
	return userId;
}

function validateJournalId(id, res) {
	if (!mongoose.Types.ObjectId.isValid(String(id))) {
		res.status(400).json({ message: "Invalid journal id" });
		return false;
	}
	return true;
}

router.get("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const entries = await Journal.find({ userId }).sort({ createdAt: -1 }).limit(50);
		res.json(entries);
	} catch (error) {
		res.status(500).json({ message: error.message || "Could not load journals" });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const content = (req.body.content || "").trim();
		if (!content) {
			return res.status(400).json({ message: "Journal content is required" });
		}
		const title = (req.body.title || "Daily Reflection").trim();
		const tags = Array.isArray(req.body.tags)
			? req.body.tags.filter(Boolean).map((tag) => String(tag).trim())
			: [];

		const entry = await Journal.create({ content, title, tags, userId });
		res.status(201).json(entry);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateJournalId(req.params.id, res)) {
			return;
		}

		const content = (req.body.content || "").trim();
		if (!content) {
			return res.status(400).json({ message: "Journal content is required" });
		}
		const title = (req.body.title || "Daily Reflection").trim();
		const tags = Array.isArray(req.body.tags)
			? req.body.tags.filter(Boolean).map((tag) => String(tag).trim())
			: [];

		const updated = await Journal.findOneAndUpdate(
			{ _id: req.params.id, userId },
			{ $set: { title, content, tags } },
			{ new: true }
		);

		if (!updated) {
			return res.status(404).json({ message: "Journal entry not found" });
		}

		return res.json(updated);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateJournalId(req.params.id, res)) {
			return;
		}

		const deleted = await Journal.findOneAndDelete({ _id: req.params.id, userId });
		if (!deleted) {
			return res.status(404).json({ message: "Journal entry not found" });
		}

		return res.json({ message: "Journal entry deleted", _id: deleted._id });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

export default router;
