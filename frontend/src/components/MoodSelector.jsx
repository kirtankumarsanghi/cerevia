const moods = [
	{ icon: "low", label: "Low" },
	{ icon: "neutral", label: "Neutral" },
	{ icon: "good", label: "Good" },
	{ icon: "radiant", label: "Radiant" }
];

function MoodIcon({ type }) {
	if (type === "low") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm-4 8.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 8 11.5Zm8 0a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 16 11.5Zm-7 4.5a1 1 0 0 1 .7-1.22A11.65 11.65 0 0 1 12 14.5a11.65 11.65 0 0 1 2.3.28 1 1 0 0 1-.4 1.96A9.93 9.93 0 0 0 12 16.5a9.93 9.93 0 0 0-1.9.24A1 1 0 0 1 9 16Z" />
			</svg>
		);
	}

	if (type === "neutral") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm-4 8.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 8 11.5Zm8 0a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 16 11.5ZM8.75 15h6.5a1 1 0 0 1 0 2h-6.5a1 1 0 0 1 0-2Z" />
			</svg>
		);
	}

	if (type === "good") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm-4 8.5a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 8 11.5Zm8 0a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 16 11.5Zm-1.2 3.3a1 1 0 0 1 .4 1.36A3.79 3.79 0 0 1 12 18a3.79 3.79 0 0 1-3.2-1.84 1 1 0 1 1 1.76-.96A1.83 1.83 0 0 0 12 16a1.83 1.83 0 0 0 1.44-.8 1 1 0 0 1 1.36-.4Z" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="M11.25 3.5a1 1 0 0 1 2 0V5a1 1 0 0 1-2 0Zm0 15.5a1 1 0 0 1 2 0v1.5a1 1 0 0 1-2 0ZM5 11.25a1 1 0 0 1 0 2H3.5a1 1 0 0 1 0-2Zm15.5 0a1 1 0 0 1 0 2H19a1 1 0 0 1 0-2Zm-1.83-6.08a1 1 0 0 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41Zm-12.28 12.28a1 1 0 0 1 1.41 1.41l-1.06 1.06a1 1 0 1 1-1.41-1.41Zm0-10.87a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L5.39 7.99a1 1 0 0 1 0-1.41Zm12.28 12.28a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM12 7.25A4.75 4.75 0 1 0 16.75 12 4.75 4.75 0 0 0 12 7.25Z" />
		</svg>
	);
}

export default function MoodSelector({ active = "Good", showIcon = true, onSelect, disabled = false }) {
	return (
		<div className="mood-grid">
			{moods.map((mood) => (
				<button
					key={mood.label}
					type="button"
					className={`mood-pill ${active === mood.label ? "active" : ""}`}
					onClick={() => onSelect?.(mood.label)}
					disabled={disabled}
					aria-pressed={active === mood.label}
				>
					{showIcon ? (
						<span className="pill-icon">
							<MoodIcon type={mood.icon} />
						</span>
					) : null}
					<small>{mood.label}</small>
				</button>
			))}
		</div>
	);
}
