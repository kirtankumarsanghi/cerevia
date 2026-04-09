import { Router } from "express";
import Task from "../models/Task.js";

const router = Router();

router.get("/", async (_req, res) => {
	const tasks = await Task.find().sort({ createdAt: -1 }).limit(100);
	res.json(tasks);
});

router.post("/", async (req, res) => {
	try {
		const task = await Task.create(req.body);
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.patch("/:id/toggle", async (req, res) => {
	const task = await Task.findById(req.params.id);
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}
	task.completed = !task.completed;
	await task.save();
	return res.json(task);
});

export default router;
