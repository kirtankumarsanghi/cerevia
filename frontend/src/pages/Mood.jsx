import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../api/api";

const moodTags = [
	{ label: "Radiant", icon: "radiant" },
	{ label: "Calm", icon: "calm" },
	{ label: "Muted", icon: "muted" },
	{ label: "Active", icon: "active" },
	{ label: "Flow", icon: "flow" },
	{ label: "Tired", icon: "tired" }
];

const moodScoreMap = {
	radiant: 9,
	calm: 7,
	muted: 4,
	active: 8,
	flow: 7,
	tired: 3,
	good: 7,
	neutral: 5,
	low: 2
};

function toTitleCase(value) {
	if (!value) {
		return "Unknown";
	}
	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function normalizeMood(value) {
	return String(value || "unknown").trim().toLowerCase();
}

function dateKey(dateInput) {
	const date = new Date(dateInput);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

function scoreOfMood(entry) {
	if (typeof entry?.score === "number") {
		return Math.max(1, Math.min(10, entry.score));
	}
	const normalized = normalizeMood(entry?.mood);
	return moodScoreMap[normalized] || 5;
}

function MoodTagIcon({ type }) {
	if (type === "calm") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1Zm0 17a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1ZM4.93 4.93a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 0 1-1.42 1.41L4.93 6.34a1 1 0 0 1 0-1.41Zm12.31 12.31a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 1 1-1.41 1.41l-1.42-1.42a1 1 0 0 1 0-1.41ZM2 12a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm17 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM4.93 19.07a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 1 1 1.41 1.41l-1.42 1.42a1 1 0 0 1-1.41 0Zm12.31-12.31a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 0 1 1.41 1.41l-1.42 1.42a1 1 0 0 1-1.41 0ZM12 7a5 5 0 1 0 5 5 5.01 5.01 0 0 0-5-5Z" />
			</svg>
		);
	}

	if (type === "muted") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M15 8.6a4 4 0 1 0 0 6.8V8.6Zm-4-6.1a1 1 0 0 1 1 1v1.14A7 7 0 0 1 19.36 12 7 7 0 0 1 12 19.36V20.5a1 1 0 1 1-2 0v-1.14A7 7 0 0 1 2.64 12 7 7 0 0 1 10 4.64V3.5a1 1 0 0 1 1-1Z" />
			</svg>
		);
	}

	if (type === "active") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12.65 2.15a1 1 0 0 1 .86 1.28L11.28 11H16a1 1 0 0 1 .78 1.62l-6.43 8.1a1 1 0 0 1-1.75-.9L10.72 13H6a1 1 0 0 1-.78-1.62l6.57-8.27a1 1 0 0 1 .86-.96Z" />
			</svg>
		);
	}

	if (type === "flow") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M12 3c5.1 0 9 4.23 9 8.2A8.95 8.95 0 0 1 12 20a8.95 8.95 0 0 1-9-8.8C3 7.23 6.9 3 12 3Zm0 2c-2.38 0-4.64 1.7-5.77 4.07 1.22-.53 2.75-.88 4.52-.88 3.2 0 5.61 1.12 7.03 2.05C17.41 7.2 14.94 5 12 5Zm-1.2 11.65c2.93 0 5.43-1.55 6.56-3.8-.95-.76-3.05-2.04-6.61-2.04-2.31 0-4.09.52-5.17 1.03A6.98 6.98 0 0 0 10.8 16.65Z" />
			</svg>
		);
	}

	if (type === "tired") {
		return (
			<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
				<path d="M14.5 2a8.5 8.5 0 1 0 7.5 12.5A7.5 7.5 0 1 1 14.5 2Z" />
			</svg>
		);
	}

	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="M11.2 3.2a1 1 0 0 1 1.6 0l1 1.45a1 1 0 0 0 .58.39l1.72.48a1 1 0 0 1 .31 1.76l-1.14.99a1 1 0 0 0-.33 1.03l.08.42a1 1 0 0 1-1.53 1.03L12 10.06l-1.49.71a1 1 0 0 1-1.53-1.03l.08-.42a1 1 0 0 0-.33-1.03L7.59 7.3A1 1 0 0 1 7.9 5.54l1.72-.48a1 1 0 0 0 .58-.39l1-1.45ZM4 13.5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2Zm2 4h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2Z" />
		</svg>
	);
}

export default function Mood() {
	const [selectedMood, setSelectedMood] = useState("Radiant");
	const [note, setNote] = useState("");
	const [moods, setMoods] = useState([]);
	const [loading, setLoading] = useState(true);
	const [status, setStatus] = useState("");
	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		async function loadMoods() {
			setLoading(true);
			setError("");
			try {
				const moodRows = await api.getMoods();
				setMoods(moodRows);
			} catch (error) {
				setError(error.message || "Could not load mood history");
			} finally {
				setLoading(false);
			}
		}

		loadMoods();
	}, []);

	const distribution = useMemo(() => {
		if (!moods.length) {
			return [
				{ label: "Radiant", value: 0, count: 0 },
				{ label: "Calm", value: 0, count: 0 },
				{ label: "Muted", value: 0, count: 0 },
				{ label: "Active", value: 0, count: 0 }
			];
		}

		const counts = moods.reduce((acc, item) => {
			const label = toTitleCase(normalizeMood(item.mood));
			acc[label] = (acc[label] || 0) + 1;
			return acc;
		}, {});

		const total = moods.length;
		return Object.entries(counts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6)
			.map(([label, count]) => ({
				label,
				count,
				value: Math.round((count / total) * 100)
			}));
	}, [moods]);

	const chartData = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const dayMap = {};
		for (let i = 13; i >= 0; i -= 1) {
			const day = new Date(today);
			day.setDate(today.getDate() - i);
			const key = dateKey(day);
			dayMap[key] = {
				date: day,
				key,
				label: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
				scoreSum: 0,
				count: 0
			};
		}

		moods.forEach((entry) => {
			const key = dateKey(entry.createdAt);
			if (!dayMap[key]) {
				return;
			}
			dayMap[key].scoreSum += scoreOfMood(entry);
			dayMap[key].count += 1;
		});

		return Object.values(dayMap).map((day) => ({
			...day,
			avgScore: day.count ? Number((day.scoreSum / day.count).toFixed(1)) : 0
		}));
	}, [moods]);

	const moodActivity = useMemo(() => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const counts = moods.reduce((acc, entry) => {
			const key = dateKey(entry.createdAt);
			if (!key) {
				return acc;
			}
			acc[key] = (acc[key] || 0) + 1;
			return acc;
		}, {});

		const days = [];
		for (let i = 27; i >= 0; i -= 1) {
			const day = new Date(today);
			day.setDate(today.getDate() - i);
			const key = dateKey(day);
			const count = counts[key] || 0;
			days.push({
				key,
				count,
				label: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
				intensity: count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0
			});
		}

		return days;
	}, [moods]);

	const reflection = useMemo(() => {
		if (!moods.length) {
			return "No mood history yet. Start with your first check-in to unlock personalized reflection and trend analysis.";
		}

		const recentScores = moods.slice(0, 7).map(scoreOfMood);
		const previousScores = moods.slice(7, 14).map(scoreOfMood);
		const recentAvg = recentScores.length
			? recentScores.reduce((sum, value) => sum + value, 0) / recentScores.length
			: 0;
		const previousAvg = previousScores.length
			? previousScores.reduce((sum, value) => sum + value, 0) / previousScores.length
			: 0;

		const frequent = distribution[0]?.label || "your current pattern";
		if (!previousScores.length) {
			return `Current mood pattern is trending around ${frequent}. Keep logging daily to unlock week-over-week analysis.`;
		}

		const delta = Math.round(((recentAvg - previousAvg) / Math.max(previousAvg, 1)) * 100);
		if (delta > 0) {
			return `Your recent mood baseline improved by ${delta}% versus the previous week, with ${frequent} appearing most often.`;
		}
		if (delta < 0) {
			return `Your recent mood baseline dipped by ${Math.abs(delta)}% versus the previous week. ${frequent} is still your dominant state.`;
		}
		return `Your mood baseline is stable week-over-week, and ${frequent} remains your most frequent state.`;
	}, [moods, distribution]);

	async function handleSaveMood() {
		if (saving) {
			return;
		}
		setSaving(true);
		setStatus("");
		setError("");
		try {
			const created = await api.saveMood({
				mood: selectedMood,
				note,
				score: moodScoreMap[normalizeMood(selectedMood)]
			});
			setMoods((prev) => [created, ...prev]);
			setStatus("Mood saved.");
			setNote("");
		} catch (error) {
			setError(error.message || "Could not save mood");
		} finally {
			setSaving(false);
		}
	}

	return (
		<main className="page mood-page">
			<section className="hero-intro">
				<small className="eyebrow">Personal Growth</small>
				<h1>
					Mood <em>Landscape</em>
				</h1>
				<p>Visualizing the gentle currents of your emotional journey in real time.</p>
			</section>

			<section className="mood-layout">
				<div className="mood-left-stack">
					<Card title="How are you feeling?">
						<div className="mini-moods">
							{moodTags.map((tag) => (
								<button
									key={tag.label}
									type="button"
									className={`mini-mood ${selectedMood === tag.label ? "active" : ""}`}
									onClick={() => setSelectedMood(tag.label)}
								>
									<span className="mini-mood-icon">
										<MoodTagIcon type={tag.icon} />
									</span>
									<span>{tag.label}</span>
								</button>
							))}
						</div>
						<textarea
							placeholder="A quiet morning, a warm cup of coffee..."
							rows="4"
							value={note}
							onChange={(event) => setNote(event.target.value)}
						/>
						<div className="editor-footer">
							<small>{status || `Selected mood: ${selectedMood}`}</small>
							<button type="button" onClick={handleSaveMood} disabled={saving}>
								{saving ? "Saving..." : "Save Mood"}
							</button>
						</div>
						{loading ? <p className="status-line">Loading mood history...</p> : null}
						{error ? <p className="status-line error">{error}</p> : null}
					</Card>

					<Card className="tip-card" title="Breathe into the data">
						Total check-ins logged: {moods.length}. The more consistent your logs, the more accurate your emotional pattern analysis becomes.
					</Card>
				</div>

				<div className="mood-right-stack">
					<Card className="chart-card" title="Mood Fluctuations" subtitle="Past 14 days analysis">
						{chartData.some((day) => day.count > 0) ? (
							<div className="live-chart" role="img" aria-label="Mood score trend over last 14 days">
								{chartData.map((day) => (
									<div className="live-bar-wrap" key={day.key} title={`${day.label}: ${day.avgScore}/10 (${day.count} check-ins)`}>
										<div className="live-bar" style={{ height: `${Math.max(8, day.avgScore * 10)}%` }} />
										<small>{day.label.split(" ")[1]}</small>
									</div>
								))}
							</div>
						) : (
							<div className="chart-placeholder wave">
								<p className="status-line">No trend data yet. Save moods to build your chart.</p>
							</div>
						)}
					</Card>

					<div className="mood-subgrid">
						<Card title="Last 28 Days" subtitle="Mood activity calendar">
							<div className="calendar-grid">
								{moodActivity.map((day) => (
									<div key={day.key} className={`calendar-cell intensity-${day.intensity}`} title={`${day.label}: ${day.count} check-ins`} />
								))}
							</div>
							<p className="calendar-legend">Lighter cells mean fewer check-ins, darker cells mean more activity.</p>
						</Card>
						<Card title="Mood Distribution">
							{distribution.map((item) => (
								<div className="dist-row" key={item.label}>
									<span>{item.label}</span>
									<div className="dist-metric">
										<em>{item.count}</em>
										<strong>{item.value}%</strong>
									</div>
								</div>
							))}
						</Card>
					</div>
				</div>
			</section>

			<Card className="reflection-bar" title="AI-Powered Reflection">
				{reflection}
			</Card>
		</main>
	);
}
