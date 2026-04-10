import { useEffect, useState } from "react";
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
	const [useCompactLogo, setUseCompactLogo] = useState(() => {
		if (typeof window === "undefined") {
			return false;
		}
		return window.matchMedia("(max-width: 1220px)").matches;
	});

	useEffect(() => {
		const media = window.matchMedia("(max-width: 1220px)");
		function onChange(event) {
			setUseCompactLogo(event.matches);
		}
		setUseCompactLogo(media.matches);
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);

	return (
		<aside className="sidebar">
			<div className="brand-wrap">
				<NavLink to="/" className="brand-home-link" end>
					{useCompactLogo ? (
						<div className="brand-logo-compact" aria-hidden="true">
							<svg viewBox="0 0 60 60" role="presentation">
								<g transform="translate(30,15)">
									<g className="logo-brain-group">
										<path d="M 0 33 C -3 35 -8 34 -10 30 C -13 26 -13 21 -10 18 C -13 14 -13 9 -10 5 C -7 1 -2 1 0 4" className="logo-brain-shell" />
										<path d="M 0 33 C 3 35 8 34 10 30 C 13 26 13 21 10 18 C 13 14 13 9 10 5 C 7 1 2 1 0 4" className="logo-brain-shell" />
										<path d="M 0 5 L 0 32" className="logo-brain-mid" />
										<path d="M -8 8 C -6 7 -4 8 -4 11" className="logo-nerve" />
										<path d="M -8 16 C -5 15 -3 17 -3 20" className="logo-nerve" />
										<path d="M -7 24 C -5 23 -3 24 -3 27" className="logo-nerve" />
										<path d="M 8 8 C 6 7 4 8 4 11" className="logo-nerve" />
										<path d="M 8 16 C 5 15 3 17 3 20" className="logo-nerve" />
										<path d="M 7 24 C 5 23 3 24 3 27" className="logo-nerve" />
										<circle cx="0" cy="15" r="2.8" className="logo-pulse-dot" />
									</g>
								</g>
								<path d="M 10 46 Q 30 33 50 46" className="logo-arc" />
							</svg>
						</div>
					) : (
						<div className="brand-logo" aria-hidden="true">
							<svg viewBox="0 0 320 220" role="presentation">
								<g transform="translate(160,42)">
									<g className="logo-brain-group">
										<path d="M 0 53 C -6 57 -17 55 -23 47 C -29 40 -30 31 -24 23 C -30 15 -29 5 -22 -3 C -16 -10 -5 -10 0 -4" className="logo-brain-shell" />
										<path d="M 0 53 C 6 57 17 55 23 47 C 29 40 30 31 24 23 C 30 15 29 5 22 -3 C 16 -10 5 -10 0 -4" className="logo-brain-shell" />
										<path d="M 0 -2 L 0 52" className="logo-brain-mid" />
										<path d="M -18 1 C -12 -1 -8 2 -8 8" className="logo-nerve" />
										<path d="M -18 16 C -11 14 -7 18 -7 24" className="logo-nerve" />
										<path d="M -16 31 C -10 29 -6 32 -6 38" className="logo-nerve" />
										<path d="M -12 43 C -7 41 -4 43 -4 48" className="logo-nerve" />
										<path d="M 18 1 C 12 -1 8 2 8 8" className="logo-nerve" />
										<path d="M 18 16 C 11 14 7 18 7 24" className="logo-nerve" />
										<path d="M 16 31 C 10 29 6 32 6 38" className="logo-nerve" />
										<path d="M 12 43 C 7 41 4 43 4 48" className="logo-nerve" />
										<circle cx="0" cy="24" r="4" className="logo-pulse-dot" />
									</g>
								</g>

								<path d="M 74 112 Q 160 62 246 112" className="logo-arc" />
								<path d="M 160 104 L 160 88" className="logo-arrow-stem" />
								<path d="M 154 95 L 160 88 L 166 95" className="logo-arrow-head" />

								<text x="160" y="157" textAnchor="middle" className="logo-word">Cerivia</text>
								<line x1="72" y1="165" x2="248" y2="165" className="logo-underline-main" />
								<line x1="77" y1="178" x2="243" y2="178" className="logo-underline-sub" />
								<text x="160" y="202" textAnchor="middle" className="logo-tagline">
									Understand Your Mind, Elevate Your Life.
								</text>
							</svg>
						</div>
					)}
				</NavLink>
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
