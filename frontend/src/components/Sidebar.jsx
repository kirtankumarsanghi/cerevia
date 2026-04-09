import { NavLink } from "react-router-dom";

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
	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<h2 className="brand">
					<span>The Ethereal</span>
					<span>Sanctuary</span>
				</h2>
				<p className="brand-sub">Your Digital Breath</p>
			</div>

			<nav>
				{links.map(([to, label, icon]) => (
					<NavLink key={to} to={to} className="nav-link" end={to === "/"}>
						<span>{icon}</span>
						<span>{label}</span>
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
						<strong>Alex Rivera</strong>
						<small>Premium Member</small>
					</div>
				</div>
			</div>
		</aside>
	);
}
