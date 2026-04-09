import { Router } from "express";
import mongoose from "mongoose";
import ChatMessage from "../models/ChatMessage.js";

const router = Router();

function requireUserId(req, res) {
	const userId = req.headers["x-user-id"];
	if (!userId || !mongoose.Types.ObjectId.isValid(String(userId))) {
		res.status(401).json({ message: "Unauthorized" });
		return null;
	}
	return userId;
}

function validateChatId(id, res) {
	if (!mongoose.Types.ObjectId.isValid(String(id))) {
		res.status(400).json({ message: "Invalid message id" });
		return false;
	}
	return true;
}

function buildAssistantReply(text) {
	const input = text.toLowerCase();

	if (input.includes("anx") || input.includes("stress") || input.includes("overwhelm")) {
		return "I hear you. Try this: inhale for 4 seconds, hold for 4, exhale for 6. Would you like another grounding prompt?";
	}

	if (input.includes("sleep") || input.includes("tired")) {
		return "Sleep struggles are hard. A gentle wind-down can help: dim lights, avoid screens for 20 minutes, then do a short breathing cycle.";
	}

	if (input.includes("focus") || input.includes("work")) {
		return "Let us make this manageable. Pick one 10-minute task, complete it, then take a 2-minute breath break before the next step.";
	}

	return "Thank you for sharing that. I am here with you. Do you want to reflect more, or would a quick calming exercise help right now?";
}

router.get("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const messages = await ChatMessage.find({ userId }).sort({ createdAt: 1 }).limit(40);
		res.json(messages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}
		const userText = (req.body.text || "").trim();
		if (!userText) {
			return res.status(400).json({ message: "Message text is required" });
		}
		if (userText.length > 1200) {
			return res.status(400).json({ message: "Message is too long" });
		}

		const userMessage = await ChatMessage.create({ userId, role: "user", text: userText });
		const assistantText = buildAssistantReply(userText);
		const assistantMessage = await ChatMessage.create({ userId, role: "assistant", text: assistantText });

		return res.status(201).json({ userMessage, assistantMessage });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

router.patch("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateChatId(req.params.id, res)) {
			return;
		}

		const text = (req.body.text || "").trim();
		if (!text) {
			return res.status(400).json({ message: "Message text is required" });
		}
		if (text.length > 1200) {
			return res.status(400).json({ message: "Message is too long" });
		}

		const updated = await ChatMessage.findOneAndUpdate(
			{ _id: req.params.id, userId, role: "user" },
			{ $set: { text } },
			{ new: true }
		);

		if (!updated) {
			return res.status(404).json({ message: "Message not found" });
		}

		return res.json(updated);
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId || !validateChatId(req.params.id, res)) {
			return;
		}

		const deleted = await ChatMessage.findOneAndDelete({ _id: req.params.id, userId, role: "user" });
		if (!deleted) {
			return res.status(404).json({ message: "Message not found" });
		}

		return res.json({ message: "Message deleted", _id: deleted._id });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

router.delete("/", async (req, res) => {
	try {
		const userId = requireUserId(req, res);
		if (!userId) {
			return;
		}

		await ChatMessage.deleteMany({ userId });
		return res.json({ message: "Chat history cleared" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

export default router;
