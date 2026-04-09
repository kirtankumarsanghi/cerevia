import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const links = [
	["/", "Home", "⌂"],
	["/mood", "Mood", "☺"],
	["/chat", "Chat", "✎"],
	["/journal", "Journal", "≡"],
	["/tasks", "Tasks", "✓"],
	["/analytics", "Analytics", "↗"],
	["/support", "Support", "◍"],
	["/breathing", "Breathing", "◌"]
];

export default function Sidebar() {
	const { user, logout } = useAuth();

	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<div className="brand-mark" aria-hidden="true" />
				<h2 className="brand">
					<span>Cerivia</span>
				</h2>
				<p className="brand-sub">Understand Your Mind, Elevate Your Life.</p>
			</div>

			<nav>
				{links.map(([to, label, icon]) => (
					<NavLink key={to} to={to} className="nav-link" end={to === "/"}>
						<span className="nav-icon">{icon}</span>
						<span className="nav-text">{label}</span>
					</NavLink>
				))}
			</nav>

			<div className="sidebar-bottom">
				<button className="breathe-btn" type="button">
					Breathe Now
				</button>
				<div className="profile-card">
					<div className="avatar">👨🏻</div>
					<div>
						<strong>{user?.name || "Guest User"}</strong>
						<small>Premium Member</small>
					</div>
				</div>
				<button className="ghost-btn logout-btn" type="button" onClick={logout}>
					Logout
				</button>
			</div>
		</aside>
	);
}
