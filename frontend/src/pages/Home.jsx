import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import MoodSelector from "../components/MoodSelector";
import { api } from "../api/api";
import { useAuth } from "../auth/AuthContext";

const moodScoreMap = {
	low: 2,
	neutral: 5,
	good: 7,
	radiant: 9,
	calm: 7,
	muted: 4,
	active: 8,
	flow: 7,
	tired: 3
};

function moodToScore(label) {
	if (!label) {
		return 5;
	}
	return moodScoreMap[label.toLowerCase()] || 5;
}

function average(values) {
	if (!values.length) {
		return 0;
	}
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatRelativeDate(dateInput) {
	if (!dateInput) {
		return "Recently";
	}
	const date = new Date(dateInput);
	if (Number.isNaN(date.getTime())) {
		return "Recently";
	}

	const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
	if (diffDays <= 0) {
		return "Today";
	}
	if (diffDays === 1) {
		return "Yesterday";
	}
	return `${diffDays} days ago`;
}

export default function Home() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [moods, setMoods] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [journals, setJournals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [savingMood, setSavingMood] = useState(false);
	const [moodStatus, setMoodStatus] = useState("");
	const [error, setError] = useState("");

	const firstName = useMemo(() => {
		if (!user?.name) {
			return "there";
		}
		return user.name.split(" ")[0];
	}, [user]);

	useEffect(() => {
		async function loadDashboardData() {
			setLoading(true);
			setError("");
			try {
				const [moodResult, taskResult, journalResult] = await Promise.allSettled([
					api.getMoods(),
					api.getTasks(),
					api.getJournals()
				]);

				const nextMoods = moodResult.status === "fulfilled" ? moodResult.value : [];
				const nextTasks = taskResult.status === "fulfilled" ? taskResult.value : [];
				const nextJournals = journalResult.status === "fulfilled" ? journalResult.value : [];

				setMoods(nextMoods);
				setTasks(nextTasks);
				setJournals(nextJournals);

				const failedMessages = [moodResult, taskResult, journalResult]
					.filter((result) => result.status === "rejected")
					.map((result) => result.reason?.message)
					.filter(Boolean);

				if (failedMessages.length) {
					setError(`Some live data could not load: ${failedMessages[0]}`);
				}
			} catch (loadError) {
				setError(loadError.message || "Could not load live dashboard data");
			} finally {
				setLoading(false);
			}
		}

		loadDashboardData();
	}, []);

	async function handleQuickMoodSelect(nextMood) {
		if (!nextMood || savingMood) {
			return;
		}

		setSavingMood(true);
		setMoodStatus("");
		setError("");
		try {
			const created = await api.saveMood({ mood: nextMood, note: "Quick home check-in" });
			setMoods((prev) => [created, ...prev]);
			setMoodStatus(`Saved mood check-in: ${nextMood}`);
		} catch (saveError) {
			setError(saveError.message || "Could not save mood check-in");
		} finally {
			setSavingMood(false);
		}
	}

	const latestMood = moods[0]?.mood || "Good";

	const trend = useMemo(() => {
		if (!moods.length) {
			return {
				title: "Weekly Trend: Waiting for data",
				description: "Add a few mood check-ins to unlock your weekly trend."
			};
		}

		const scores = moods.map((entry) => moodToScore(entry.mood));
		const recentScores = scores.slice(0, 7);
		const previousScores = scores.slice(7, 14);
		const recentAvg = average(recentScores);
		const previousAvg = average(previousScores);
		if (!previousScores.length || previousAvg === 0) {
			return {
				title: "Weekly Trend: Building baseline",
				description: "Keep checking in for a few more days to compare weekly progress."
			};
		}

		const delta = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
		if (delta > 0) {
			return {
				title: `Weekly Trend: Ascending`,
				description: `Your mood improved by ${delta}% compared to last week.`
			};
		}

		if (delta < 0) {
			return {
				title: "Weekly Trend: Slight dip",
				description: `Your mood is ${Math.abs(delta)}% lower than last week. Try a short reset ritual today.`
			};
		}

		return {
			title: "Weekly Trend: Steady",
			description: "Your mood is stable compared to last week. Consistency is a strength."
		};
	}, [moods]);

	const journeyItems = useMemo(() => {
		const moodItems = moods.slice(0, 3).map((entry) => ({
			date: entry.createdAt,
			title: `Mood check-in: ${entry.mood || "Logged"}`,
			detail: entry.note || `${formatRelativeDate(entry.createdAt)} mood reflection saved.`
		}));

		const taskItems = tasks.slice(0, 3).map((task) => ({
			date: task.updatedAt || task.createdAt,
			title: task.completed ? `Completed: ${task.title}` : `Task added: ${task.title}`,
			detail: task.completed
				? `${formatRelativeDate(task.updatedAt || task.createdAt)} you completed this intention.`
				: `${formatRelativeDate(task.createdAt)} this intention was added.`
		}));

		const journalItems = journals.slice(0, 3).map((entry) => ({
			date: entry.createdAt,
			title: entry.title || "Daily Reflection",
			detail: entry.content || "Journal entry saved"
		}));

		return [...moodItems, ...taskItems, ...journalItems]
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, 3);
	}, [moods, tasks, journals]);

	const vitals = useMemo(() => {
		const completedCount = tasks.filter((task) => task.completed).length;
		const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
		const checkIns = moods.length;
		const journalThisWeek = journals.filter((entry) => {
			const createdAt = new Date(entry.createdAt).getTime();
			return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
		}).length;

		return {
			completion,
			checkIns,
			journalThisWeek
		};
	}, [tasks, moods, journals]);

	const proTip = useMemo(() => {
		if (vitals.completion < 40) {
			return "Start with one easy intention this morning to build momentum for the rest of the day.";
		}
		if (vitals.journalThisWeek < 2) {
			return "Try a 3-minute journal check-in tonight to strengthen your reflection habit.";
		}
		if (vitals.checkIns < 3) {
			return "Log mood twice daily this week for clearer trend insights and better recommendations.";
		}
		return "Great consistency this week. Keep pairing breathwork with journaling for deeper calm.";
	}, [vitals]);

	return (
		<main className="page home-page">
			<section className="hero-intro home-hero">
				<small className="eyebrow">Cerivia - Understand Your Mind, Elevate Your Life.</small>
				<h1>Hello, {firstName}</h1>
				<p>
					The morning sun is gentle today. Take a moment to settle into your
					sanctuary.
				</p>
			</section>

			<section className="home-top">
				<Card className="mood-card mood-check" title="How are you feeling right now?">
					<MoodSelector active={latestMood} onSelect={handleQuickMoodSelect} disabled={savingMood || loading} />
					<div className="trend-box">
						<strong>{trend.title}</strong>
						<p>{trend.description}</p>
					</div>
					{loading ? <p className="status-line">Loading your live dashboard...</p> : null}
					{moodStatus ? <p className="status-line">{moodStatus}</p> : null}
					{error ? <p className="status-line error">{error}</p> : null}
				</Card>

				<Card className="session-card forest-card" subtitle="Guided Suggestion">
					<h2>Forest Rain Soundscape</h2>
					<p>
						A 12-minute immersive audio journey to lower cortisol and improve
						focus.
					</p>
					<div className="session-footer">
						<div className="listeners">Live listeners now</div>
						<button type="button" onClick={() => navigate("/breathing")}>Play Session</button>
					</div>
				</Card>
			</section>

			<section className="quick-grid">
				<Card className="quick-card" title="Start Chat" subtitle="Connect with your dedicated care companion for a quick check-in.">
					<div className="quick-icon">Chat</div>
					<button type="button" className="quick-action" onClick={() => navigate("/chat")}>Open Chat</button>
				</Card>
				<Card className="quick-card" title="New Journal" subtitle="Capture your thoughts in your private, encrypted digital diary.">
					<div className="quick-icon">Write</div>
					<button type="button" className="quick-action" onClick={() => navigate("/journal")}>Open Journal</button>
				</Card>
				<Card className="quick-card" title="Breathing Exercise" subtitle="A simple 2-minute rhythm to reset your nervous system.">
					<div className="quick-icon">Flow</div>
					<button type="button" className="quick-action" onClick={() => navigate("/breathing")}>Start Breathing</button>
				</Card>
			</section>

			<section className="home-footer">
				<Card className="journey-card">
					<div className="journey-head">
						<h3>Your Journey</h3>
						<button type="button" className="history-link" onClick={() => navigate("/journal")}>View History</button>
					</div>
					<ul className="timeline">
						{journeyItems.map((item, index) => (
							<li key={`${item.title}-${index}`}>
								<strong>{item.title}</strong>
								<p>{item.detail}</p>
							</li>
						))}
						{journeyItems.length === 0 ? (
							<li>
								<strong>No activity yet</strong>
								<p>Start with a mood check-in, a task, or a journal note.</p>
							</li>
						) : null}
					</ul>
				</Card>

				<div className="stack right-stack">
					<Card className="vitals-card" title="Connected Vitals">
						<div className="vitals">
							<p className="vital-row">
								<span>Task Completion</span>
								<strong>{vitals.completion}%</strong>
							</p>
							<p className="vital-row">
								<span>Mood Check-ins</span>
								<strong>{vitals.checkIns}</strong>
							</p>
							<p className="vital-row">
								<span>Journal Entries (7d)</span>
								<strong>{vitals.journalThisWeek}</strong>
							</p>
						</div>
					</Card>
					<Card className="tip-card deep-tip" title="Pro Tip">
						{proTip}
					</Card>
				</div>
			</section>
		</main>
	);
}
