import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const THEME_STORAGE_KEY = "theme";

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
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { user, logout } = useAuth();
	const placeholder = placeholders[pathname] || "Search...";
	const [openMenu, setOpenMenu] = useState(null);
	const [theme, setTheme] = useState(() => {
		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
		if (storedTheme === "light" || storedTheme === "dark") {
			return storedTheme;
		}

		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			return "dark";
		}

		return "light";
	});
	const menuRef = useRef(null);

	const notifications = useMemo(
		() => [
			{ id: 1, title: "Mood check-in", detail: "Log today's mood to keep your streak alive.", route: "/mood" },
			{ id: 2, title: "Breathing break", detail: "Run a 2-minute calm cycle anytime stress rises.", route: "/breathing" },
			{ id: 3, title: "Support ready", detail: "India helplines and city resources are one tap away.", route: "/support" }
		],
		[]
	);

	const displayName = user?.name || user?.given_name || user?.email?.split("@")[0] || "You";

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		document.body.setAttribute("data-theme", theme);
		document.body.classList.toggle("theme-dark", theme === "dark");
		document.body.classList.toggle("theme-light", theme === "light");
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	useEffect(() => {
		function handlePointerDown(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setOpenMenu(null);
			}
		}

		function handleEscape(event) {
			if (event.key === "Escape") {
				setOpenMenu(null);
			}
		}

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
		};
	}, []);

	useEffect(() => {
		setOpenMenu(null);
	}, [pathname]);

	function toggleTheme() {
		setTheme((previousTheme) => (previousTheme === "light" ? "dark" : "light"));
	}

	function handleLogout() {
		logout();
		navigate("/auth", { replace: true });
	}

	return (
		<header className="topbar">
			<input className="search-input" placeholder={placeholder} />
			<div className="topbar-icons" ref={menuRef}>
				<div className="top-action">
					<button
						className="top-icon"
						type="button"
						aria-label="Notifications"
						aria-expanded={openMenu === "notifications"}
						onClick={() =>
							setOpenMenu((currentMenu) =>
								currentMenu === "notifications" ? null : "notifications"
							)
						}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path d="M12 3a5 5 0 0 0-5 5v2.58a2 2 0 0 1-.41 1.22l-1.3 1.73A1 1 0 0 0 6.1 15h11.8a1 1 0 0 0 .81-1.47l-1.3-1.73A2 2 0 0 1 17 10.58V8a5 5 0 0 0-5-5Zm0 18a3 3 0 0 0 2.83-2H9.17A3 3 0 0 0 12 21Z" />
						</svg>
						<span className="top-icon-badge" aria-hidden="true">
							{notifications.length}
						</span>
					</button>
					{openMenu === "notifications" ? (
						<div className="top-popover notifications-popover" role="menu" aria-label="Notifications menu">
							<p className="menu-title">Recent notifications</p>
							<ul className="menu-list">
								{notifications.map((item) => (
									<li key={item.id}>
										<button
											type="button"
											className="menu-item"
											onClick={() => {
												navigate(item.route);
												setOpenMenu(null);
											}}
										>
											<strong>{item.title}</strong>
											<span>{item.detail}</span>
										</button>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</div>

				<button
					className="top-icon"
					type="button"
					aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
					onClick={toggleTheme}
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						{theme === "light" ? (
							<path d="M21 12.79A9 9 0 1 1 11.21 3c-.27.89-.41 1.82-.41 2.79A9 9 0 0 0 21 12.79Z" />
						) : (
							<path d="M12 2a1 1 0 0 1 1 1v1.5a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9-6a1 1 0 0 1 0 2h-1.5a1 1 0 0 1 0-2H21ZM5.5 12a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h1.5a1 1 0 0 1 1 1Zm10.13 6.13a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM6.9 5.31a1 1 0 0 1 0 1.41L5.84 7.78a1 1 0 1 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 0Zm11.2 1.41a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0ZM6.9 18.13a1 1 0 0 1-1.41 0l-1.06 1.06a1 1 0 0 1-1.41-1.41l1.06-1.06a1 1 0 0 1 1.41 1.41Z" />
						)}
					</svg>
				</button>

				<div className="top-action">
					<button
						className="top-icon avatar-mini"
						type="button"
						aria-label="Profile"
						aria-expanded={openMenu === "profile"}
						onClick={() =>
							setOpenMenu((currentMenu) => (currentMenu === "profile" ? null : "profile"))
						}
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
							<path d="M12 4a4.5 4.5 0 1 0 4.5 4.5A4.5 4.5 0 0 0 12 4Zm0 10a7 7 0 0 0-7 7 1 1 0 0 0 1 1h12a1 1 0 0 0 1-1 7 7 0 0 0-7-7Z" />
						</svg>
					</button>
					{openMenu === "profile" ? (
						<div className="top-popover profile-popover" role="menu" aria-label="Profile menu">
							<p className="menu-title">Signed in as</p>
							<p className="profile-name">{displayName}</p>
							<p className="profile-email">{user?.email || "Google account"}</p>
							<div className="profile-actions">
								<button
									type="button"
									className="menu-link-btn"
									onClick={() => {
										navigate("/");
										setOpenMenu(null);
									}}
								>
									Open home
								</button>
								<button type="button" className="menu-link-btn danger" onClick={handleLogout}>
									Logout
								</button>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</header>
	);
}
