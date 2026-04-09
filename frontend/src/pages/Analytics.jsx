import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { api } from "../api/api";

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

function moodScore(entry) {
	if (typeof entry?.score === "number") {
		return Math.max(1, Math.min(10, entry.score));
	}
	const label = String(entry?.mood || "").toLowerCase();
	return moodScoreMap[label] || 5;
}

function dayKey(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatRelativeTime(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "Just now";
	}
	const diffMs = Date.now() - date.getTime();
	const diffMin = Math.floor(diffMs / (1000 * 60));
	if (diffMin < 1) {
		return "Just now";
	}
	if (diffMin < 60) {
		return `${diffMin}m ago`;
	}
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) {
		return `${diffHr}h ago`;
	}
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay < 7) {
		return `${diffDay}d ago`;
	}
	return date.toLocaleDateString();
}

export default function Analytics() {
	const [moods, setMoods] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [journals, setJournals] = useState([]);
	const [chatMessages, setChatMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState("");
	const [lastUpdatedAt, setLastUpdatedAt] = useState("");

	async function loadAnalytics({ silent = false } = {}) {
		if (silent) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}
		setError("");

		try {
			const [moodsResult, tasksResult, journalsResult, chatResult] = await Promise.allSettled([
				api.getMoods(),
				api.getTasks(),
				api.getJournals(),
				api.getChatMessages()
			]);

			setMoods(moodsResult.status === "fulfilled" ? moodsResult.value : []);
			setTasks(tasksResult.status === "fulfilled" ? tasksResult.value : []);
			setJournals(journalsResult.status === "fulfilled" ? journalsResult.value : []);
			setChatMessages(chatResult.status === "fulfilled" ? chatResult.value : []);

			const failures = [moodsResult, tasksResult, journalsResult, chatResult]
				.filter((result) => result.status === "rejected")
				.map((result) => result.reason?.message)
				.filter(Boolean);

			if (failures.length) {
				setError(`Some analytics data could not load: ${failures[0]}`);
			}

			setLastUpdatedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
		} catch (loadError) {
			setError(loadError.message || "Could not load analytics data");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}

	useEffect(() => {
		loadAnalytics();

		const timer = setInterval(() => {
			loadAnalytics({ silent: true });
		}, 30000);

		return () => clearInterval(timer);
	}, []);

	const summary = useMemo(() => {
		const completed = tasks.filter((task) => task.completed).length;
		const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

		const avgMood = moods.length
			? Number((moods.reduce((sum, mood) => sum + moodScore(mood), 0) / moods.length).toFixed(1))
			: 0;

		const recentScores = moods.slice(0, 7).map(moodScore);
		const previousScores = moods.slice(7, 14).map(moodScore);
		const recentAvg = recentScores.length
			? recentScores.reduce((sum, value) => sum + value, 0) / recentScores.length
			: 0;
		const previousAvg = previousScores.length
			? previousScores.reduce((sum, value) => sum + value, 0) / previousScores.length
			: 0;
		const moodDelta = previousScores.length
			? Math.round(((recentAvg - previousAvg) / Math.max(previousAvg, 1)) * 100)
			: 0;

		const last7Days = new Date();
		last7Days.setDate(last7Days.getDate() - 7);
		const journalDays = new Set(
			journals
				.filter((entry) => new Date(entry.createdAt) >= last7Days)
				.map((entry) => dayKey(entry.createdAt))
				.filter(Boolean)
		).size;

		const userChats7d = chatMessages.filter(
			(msg) => msg.role === "user" && new Date(msg.createdAt) >= last7Days
		).length;

		return {
			completionRate,
			completed,
			totalTasks: tasks.length,
			avgMood,
			moodDelta,
			journalDays,
			userChats7d,
			pulseScore: Math.round((completionRate * 0.45) + ((avgMood / 10) * 55))
		};
	}, [tasks, moods, journals, chatMessages]);

	const taskWeek = useMemo(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const data = [];
		for (let i = 6; i >= 0; i -= 1) {
			const day = new Date(now);
			day.setDate(now.getDate() - i);
			const key = dayKey(day);
			const count = tasks.filter(
				(task) => task.completed && key === dayKey(task.updatedAt || task.createdAt)
			).length;
			data.push({
				key,
				count,
				label: day.toLocaleDateString(undefined, { weekday: "short" })
			});
		}
		return data;
	}, [tasks]);

	const moodWeek = useMemo(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const data = [];
		for (let i = 6; i >= 0; i -= 1) {
			const day = new Date(now);
			day.setDate(now.getDate() - i);
			const key = dayKey(day);
			const dayMoods = moods.filter((entry) => dayKey(entry.createdAt) === key);
			const value = dayMoods.length
				? Number((dayMoods.reduce((sum, entry) => sum + moodScore(entry), 0) / dayMoods.length).toFixed(1))
				: 0;
			data.push({ key, value, label: day.toLocaleDateString(undefined, { weekday: "short" }) });
		}
		return data;
	}, [moods]);

	const activityFeed = useMemo(() => {
		const moodItems = moods.map((item) => ({
			date: item.createdAt,
			kind: "mood",
			text: `Mood check-in: ${item.mood || "Logged"}`
		}));
		const taskItems = tasks.map((item) => ({
			date: item.updatedAt || item.createdAt,
			kind: item.completed ? "task-done" : "task",
			text: item.completed ? `Task completed: ${item.title}` : `Task added: ${item.title}`
		}));
		const journalItems = journals.map((item) => ({
			date: item.createdAt,
			kind: "journal",
			text: `Journal entry: ${item.title || "Daily Reflection"}`
		}));
		const chatItems = chatMessages
			.filter((item) => item.role === "user")
			.map((item) => ({
				date: item.createdAt,
				kind: "chat",
				text: `Chat shared: ${item.text.slice(0, 60)}${item.text.length > 60 ? "..." : ""}`
			}));

		return [...moodItems, ...taskItems, ...journalItems, ...chatItems]
			.filter((item) => item.date)
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, 8);
	}, [moods, tasks, journals, chatMessages]);

	const summaryInsights = useMemo(() => {
		const completedWeek = taskWeek.reduce((sum, item) => sum + item.count, 0);
		const bestMoodDay = [...moodWeek]
			.sort((a, b) => b.value - a.value)
			.find((item) => item.value > 0);
		const focusLabel = summary.completionRate >= 60
			? "Consistency is strong"
			: "Focus on closure";

		return {
			completedWeek,
			bestMoodDay: bestMoodDay ? `${bestMoodDay.label} (${bestMoodDay.value}/10)` : "No data yet",
			focusLabel,
			totalEvents: activityFeed.length
		};
	}, [taskWeek, moodWeek, summary.completionRate, activityFeed.length]);

	return (
		<main className="page analytics-page">
			<section className="hero-intro analytics-hero">
				<h1>Live Analytics</h1>
				<p>Real-time insights from your tasks, moods, journal, and support chat.</p>
				<div className="analytics-hero-actions">
					<button type="button" className="ghost-btn" onClick={() => loadAnalytics()} disabled={loading || refreshing}>
						{loading || refreshing ? "Refreshing..." : "Refresh Data"}
					</button>
					{lastUpdatedAt ? <small>Last updated {lastUpdatedAt}</small> : null}
				</div>
				<div className="analytics-hero-chips">
					<span>Pulse Score: {summary.pulseScore}</span>
					<span>Tracked Tasks: {summary.totalTasks}</span>
					<span>Mood Logs: {moods.length}</span>
				</div>
			</section>

			{loading ? <p className="status-line">Loading analytics...</p> : null}
			{error ? <p className="status-line error">{error}</p> : null}

			<div className="analytics-block-head">Performance Overview</div>
			<section className="analytics-metrics">
				<Card className="metric-card analytics-metric-card" title="Task Completion" subtitle="Current overall rate">
					<div className="analytics-metric-value">{summary.completionRate}%</div>
					<div className="bar analytics-progress">
						<span style={{ width: `${summary.completionRate}%` }} />
					</div>
					<p className="metric-note">{summary.completed} completed out of {summary.totalTasks}</p>
				</Card>
				<Card className="metric-card analytics-metric-card" title="Average Mood" subtitle="Across all check-ins">
					<div className="analytics-metric-value">{summary.avgMood || 0}<small>/10</small></div>
					<p className="metric-note">Weekly mood change: {summary.moodDelta > 0 ? `+${summary.moodDelta}` : summary.moodDelta}%</p>
				</Card>
				<Card className="metric-card analytics-metric-card" title="Journal Consistency" subtitle="Unique days active (7d)">
					<div className="analytics-metric-value">{summary.journalDays}<small>/7</small></div>
					<p className="metric-note">Completed tasks: {summary.completed}</p>
				</Card>
				<Card className="metric-card analytics-metric-card" title="Chat Engagement" subtitle="Your messages in last 7 days">
					<div className="analytics-metric-value">{summary.userChats7d}</div>
					<p className="metric-note">Conversations increase when emotional load rises.</p>
				</Card>
			</section>

			<div className="analytics-block-head">Trend Charts</div>
			<section className="analytics-layout">
				<Card className="analytics-chart-card" title="Task Completions (7d)" subtitle="Completed items per day">
					<div className="mini-chart">
						{taskWeek.map((item) => (
							<div key={item.key} className="mini-chart-col" title={`${item.label}: ${item.count} completions`}>
								<div
									className="mini-chart-bar"
									style={{
										height: `${Math.max(8, item.count * 18)}px`,
										opacity: item.count ? 1 : 0.22
									}}
								/>
								<small>{item.label}</small>
							</div>
						))}
					</div>
				</Card>

				<Card className="analytics-chart-card" title="Mood Baseline (7d)" subtitle="Average mood score per day">
					<div className="mini-chart">
						{moodWeek.map((item) => (
							<div key={item.key} className="mini-chart-col" title={`${item.label}: ${item.value}/10`}>
								<div
									className="mini-chart-bar mood"
									style={{
										height: `${Math.max(8, item.value * 12)}px`,
										opacity: item.value ? 1 : 0.22
									}}
								/>
								<small>{item.label}</small>
							</div>
						))}
					</div>
				</Card>
			</section>

			<div className="analytics-block-head">Timeline And Health Summary</div>
			<section className="analytics-bottom-grid">
				<Card className="analytics-feed-card" title="Recent Activity Feed" subtitle="Latest live events from your wellness journey">
					<ul className="analytics-feed">
						{activityFeed.map((item, index) => (
							<li key={`${item.date}-${index}`}>
								<div className="analytics-feed-head">
									<span className={`feed-kind ${item.kind}`}>{item.kind.replace("-", " ")}</span>
									<small>{formatRelativeTime(item.date)}</small>
								</div>
								<strong>{item.text}</strong>
							</li>
						))}
						{activityFeed.length === 0 ? (
							<li>
								<strong>No activity yet.</strong>
								<small>Start using tasks, moods, journal, and chat to generate analytics.</small>
							</li>
						) : null}
					</ul>
				</Card>

				<Card className="analytics-summary-card" title="System Summary" subtitle="Current snapshot of your routine">
					<div className="analytics-summary-grid">
						<div>
							<small>Weekly completions</small>
							<strong>{summaryInsights.completedWeek}</strong>
						</div>
						<div>
							<small>Best mood day</small>
							<strong>{summaryInsights.bestMoodDay}</strong>
						</div>
						<div>
							<small>Current focus</small>
							<strong>{summaryInsights.focusLabel}</strong>
						</div>
						<div>
							<small>Tracked events</small>
							<strong>{summaryInsights.totalEvents}</strong>
						</div>
					</div>
				</Card>
			</section>
		</main>
	);
}
