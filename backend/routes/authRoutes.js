import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const user = await User.create({ name, email, password });
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

router.post("/login", async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	return res.json({ message: "Login successful", user });
});

export default router;
