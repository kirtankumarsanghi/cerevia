import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useAuth } from "./auth/AuthContext";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Chat from "./pages/Chat";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Support from "./pages/Support";
import Breathing from "./pages/Breathing";

export default function App() {
	const { user } = useAuth();

	if (!user) {
		return (
			<Routes>
				<Route path="/auth" element={<Auth />} />
				<Route path="*" element={<Navigate to="/auth" replace />} />
			</Routes>
		);
	}

	return (
		<div className="app-shell">
			<Sidebar />
			<div className="app-main">
				<Navbar />
				<Routes>
					<Route path="/auth" element={<Navigate to="/" replace />} />
					<Route path="/" element={<Home />} />
					<Route path="/mood" element={<Mood />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/journal" element={<Journal />} />
					<Route path="/tasks" element={<Tasks />} />
					<Route path="/support" element={<Support />} />
					<Route path="/breathing" element={<Breathing />} />
					<Route path="/analytics" element={<Analytics />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</div>
	);
}
