const moods = [
	{ emoji: "😔", label: "Low" },
	{ emoji: "😐", label: "Neutral" },
	{ emoji: "😊", label: "Good" },
	{ emoji: "✨", label: "Radiant" }
];

export default function MoodSelector({ active = "Good" }) {
	return (
		<div className="mood-grid">
			{moods.map((mood) => (
				<button
					key={mood.label}
					type="button"
					className={`mood-pill ${active === mood.label ? "active" : ""}`}
				>
					<span>{mood.emoji}</span>
					<small>{mood.label}</small>
				</button>
			))}
		</div>
	);
}
