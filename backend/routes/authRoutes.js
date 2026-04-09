import { Router } from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = Router();
const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
	try {
		const { credential } = req.body;
		if (!credential) {
			return res.status(400).json({ message: "Google credential is required" });
		}

		if (!process.env.GOOGLE_CLIENT_ID) {
			return res.status(500).json({ message: "GOOGLE_CLIENT_ID is not configured on server" });
		}

		const ticket = await oauthClient.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID
		});
		const payload = ticket.getPayload();

		if (!payload?.email || !payload?.sub) {
			return res.status(401).json({ message: "Invalid Google token" });
		}

		let user = await User.findOne({ email: payload.email.toLowerCase() });
		if (!user) {
			user = await User.create({
				name: payload.name || "Cerevia User",
				email: payload.email.toLowerCase(),
				googleId: payload.sub,
				avatar: payload.picture || "",
				authProvider: "google"
			});
		} else {
			user.name = payload.name || user.name;
			user.googleId = payload.sub;
			user.avatar = payload.picture || user.avatar;
			user.authProvider = "google";
			await user.save();
		}

		return res.json({
			message: "Google login successful",
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar
			}
		});
	} catch (error) {
		return res.status(401).json({ message: error.message || "Google authentication failed" });
	}
});

router.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: "Name, email and password are required" });
		}

		const existing = await User.findOne({ email: email.toLowerCase() });
		if (existing) {
			return res.status(409).json({ message: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword });
		return res.status(201).json({
			message: "Signup successful",
			user: { _id: user._id, name: user.name, email: user.email }
		});
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		return res.json({
			message: "Login successful",
			user: { _id: user._id, name: user.name, email: user.email }
		});
	} catch (error) {
		return res.status(500).json({ message: error.message || "Login failed" });
	}
});

router.get("/me", async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const user = await User.findById(userId).select("_id name email avatar");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		return res.json(user);
	} catch (error) {
		return res.status(500).json({ message: error.message || "Could not load user profile" });
	}
});

export default router;
