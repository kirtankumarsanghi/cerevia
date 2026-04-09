import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.json({ app: "Cerevia API", status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/chat", chatRoutes);

app.use((_req, res) => {
	res.status(404).json({ message: "Route not found" });
});

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Cerevia backend running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to start Cerevia backend", error);
		process.exit(1);
	});
