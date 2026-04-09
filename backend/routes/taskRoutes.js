import { Router } from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";

const router = Router();

function requireUserId(req, res) {
	const userId = req.headers["x-user-id"];
	if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
		res.status(401).json({ message: "Unauthorized" });
		return null;
	}
	return userId;
}

function validateTaskId(id, res) {
	if (!mongoose.Types.ObjectId.isValid(String(id))) {
		res.status(400).json({ message: "Invalid task id" });
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
		const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).limit(100);
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ message: error.message || "Could not load tasks" });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const title = (req.body.title || "").trim();
		if (!title) {
			return res.status(400).json({ message: "Task title is required" });
		}
		const category = (req.body.category || "mindfulness").trim();
		const task = await Task.create({ title, category, userId });
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.patch("/:id/toggle", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateTaskId(req.params.id, res)) {
			return;
		}
		const task = await Task.findOne({ _id: req.params.id, userId });
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		task.completed = !task.completed;
		await task.save();
		return res.json(task);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateTaskId(req.params.id, res)) {
			return;
		}

		const title = (req.body.title || "").trim();
		if (!title) {
			return res.status(400).json({ message: "Task title is required" });
		}
		const category = (req.body.category || "mindfulness").trim();

		const updated = await Task.findOneAndUpdate(
			{ _id: req.params.id, userId },
			{ $set: { title, category } },
			{ new: true }
		);
		if (!updated) {
			return res.status(404).json({ message: "Task not found" });
		}

		return res.json(updated);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateTaskId(req.params.id, res)) {
			return;
		}

		const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId });
		if (!deleted) {
			return res.status(404).json({ message: "Task not found" });
		}

		return res.json({ message: "Task deleted", _id: deleted._id });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

export default router;
