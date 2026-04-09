import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Chat from "./pages/Chat";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import Support from "./pages/Support";
import Breathing from "./pages/Breathing";

function Analytics() {
	return (
		<div className="page analytics-page">
			<h1>Analytics</h1>
			<p>Insights dashboard is coming soon in Cerevia.</p>
		</div>
	);
}

export default function App() {
	return (
		<div className="app-shell">
			<Sidebar />
			<div className="app-main">
				<Navbar />
				<Routes>
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
