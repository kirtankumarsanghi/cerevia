import { useLocation } from "react-router-dom";

const placeholders = {
	"/": "Search insights...",
	"/mood": "Search insights...",
	"/chat": "Search resources...",
	"/journal": "Search entries...",
	"/tasks": "Search tasks...",
	"/support": "Search resources...",
	"/breathing": "Search exercises...",
	"/analytics": "Search analytics..."
};

export default function Navbar() {
	const { pathname } = useLocation();
	const placeholder = placeholders[pathname] || "Search...";

	return (
		<header className="topbar">
			<input className="search-input" placeholder={placeholder} />
			<div className="topbar-icons">
				<span className="top-icon">🔔</span>
				<span className="top-icon">◐</span>
				<span className="top-icon avatar-mini">◉</span>
			</div>
		</header>
	);
}
