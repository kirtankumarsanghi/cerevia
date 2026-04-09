import { useEffect, useMemo, useRef, useState } from "react";
import Card from "../components/Card";

const BREATH_CYCLE = [
	{ label: "Inhale", seconds: 4 },
	{ label: "Hold", seconds: 4 },
	{ label: "Exhale", seconds: 4 },
	{ label: "Hold", seconds: 4 }
];

const SESSION_STORAGE_KEY = "cerevia_breathing_sessions";
const CYCLE_TOTAL_SECONDS = BREATH_CYCLE.reduce((sum, phase) => sum + phase.seconds, 0);

function readStoredSessions() {
	try {
		const raw = localStorage.getItem(SESSION_STORAGE_KEY);
		const rows = raw ? JSON.parse(raw) : [];
		return Array.isArray(rows) ? rows : [];
	} catch (_error) {
		return [];
	}
}

export default function Breathing() {
	const [duration, setDuration] = useState(10);
	const [remainingSec, setRemainingSec] = useState(duration * 60);
	const [running, setRunning] = useState(false);
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [phaseRemaining, setPhaseRemaining] = useState(BREATH_CYCLE[0].seconds);
	const [cyclesCompleted, setCyclesCompleted] = useState(0);
	const [status, setStatus] = useState("Ready to begin.");
	const [sessions, setSessions] = useState(readStoredSessions);
	const phaseIndexRef = useRef(0);
	const [groundingChecks, setGroundingChecks] = useState({
		see: false,
		feel: false,
		hear: false,
		smell: false,
		taste: false
	});

	const totalSec = duration * 60;
	const elapsedSec = Math.max(0, totalSec - remainingSec);
	const progressPercent = totalSec > 0 ? Math.min(100, Math.round((elapsedSec / totalSec) * 100)) : 0;
	const estimatedCycles = Math.floor(totalSec / CYCLE_TOTAL_SECONDS);

	useEffect(() => {
		phaseIndexRef.current = phaseIndex;
	}, [phaseIndex]);

	useEffect(() => {
		if (!running) {
			return undefined;
		}

		const timer = setInterval(() => {
			setRemainingSec((prev) => {
				if (prev <= 1) {
					setRunning(false);
					setPhaseRemaining(0);
					setPhaseIndex(0);
					phaseIndexRef.current = 0;
					const finalCycles = Math.floor((duration * 60) / CYCLE_TOTAL_SECONDS);
					setCyclesCompleted(finalCycles);
					setStatus("Session complete. Great regulation work.");
					setSessions((rows) => {
						const next = [
							{
								id: `${Date.now()}`,
								createdAt: new Date().toISOString(),
								duration,
								cycles: finalCycles
							},
							...rows
						].slice(0, 8);
						localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
						return next;
					});
					return 0;
				}

				setPhaseRemaining((phaseSeconds) => {
					if (phaseSeconds <= 1) {
						const nextIndex = (phaseIndexRef.current + 1) % BREATH_CYCLE.length;
						phaseIndexRef.current = nextIndex;
						setPhaseIndex(nextIndex);
						if (nextIndex === 0) {
							setCyclesCompleted((count) => count + 1);
						}
						return BREATH_CYCLE[nextIndex].seconds;
					}
					return phaseSeconds - 1;
				});

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [running, duration]);

	const formattedTime = useMemo(() => {
		const min = Math.floor(remainingSec / 60)
			.toString()
			.padStart(2, "0");
		const sec = (remainingSec % 60).toString().padStart(2, "0");
		return `${min}:${sec}`;
	}, [remainingSec]);

	const currentPhase = BREATH_CYCLE[phaseIndex];

	const groundingProgress = useMemo(() => {
		const checks = Object.values(groundingChecks);
		const done = checks.filter(Boolean).length;
		return { done, total: checks.length };
	}, [groundingChecks]);

	function resetSessionState(nextDuration = duration) {
		setRemainingSec(nextDuration * 60);
		setPhaseIndex(0);
		phaseIndexRef.current = 0;
		setPhaseRemaining(BREATH_CYCLE[0].seconds);
		setCyclesCompleted(0);
	}

	function startSession(nextDuration = duration) {
		setDuration(nextDuration);
		resetSessionState(nextDuration);
		setRunning(true);
		setStatus("Session running. Follow the phase rhythm.");
	}

	function handleDurationChange(nextDuration) {
		setDuration(nextDuration);
		setRunning(false);
		resetSessionState(nextDuration);
		setStatus(`Duration set to ${nextDuration} minutes.`);
	}

	function handleStartPause() {
		if (running) {
			setRunning(false);
			setStatus("Session paused.");
			return;
		}

		if (remainingSec <= 0) {
			startSession(duration);
			return;
		}

		setRunning(true);
		setStatus("Session running. Follow the phase rhythm.");
	}

	function handleReset() {
		setRunning(false);
		resetSessionState(duration);
		setStatus("Session reset.");
	}

	function handleRecommendedStart(nextDuration) {
		startSession(nextDuration);
		setStatus(`Recommended ${nextDuration}-minute session started.`);
	}

	function toggleGroundingCheck(key) {
		setGroundingChecks((prev) => ({ ...prev, [key]: !prev[key] }));
	}

	function clearGrounding() {
		setGroundingChecks({
			see: false,
			feel: false,
			hear: false,
			smell: false,
			taste: false
		});
	}

	function formatSessionDate(value) {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) {
			return "Unknown";
		}
		return date.toLocaleString(undefined, {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit"
		});
	}

	return (
		<main className="page breathing-page">
			<section className="breathing-top">
				<Card className="breathing-card">
					<h1>Box Breathing</h1>
					<p>Inhale for 4 • hold for 4 • exhale for 4 • hold for 4</p>
					<div className={`breath-orb ${currentPhase.label.toLowerCase()}`}>
						<div>
							<strong>{currentPhase.label}</strong>
							<small>{phaseRemaining}s</small>
						</div>
					</div>
					<div className="breathing-live-row">
						<p className="status-line">{status}</p>
						<p className="status-line">Progress: {progressPercent}%</p>
						<p className="status-line">Cycles: {cyclesCompleted}/{estimatedCycles}</p>
					</div>
					<div className="breathing-actions">
						<button type="button" onClick={handleStartPause}>
							{running ? "Pause Session" : "Start Session"}
						</button>
						<button className="ghost-btn" type="button" onClick={handleReset}>
							Reset
						</button>
					</div>
				</Card>

				<Card className="duration-card" title="Duration And Session Log">
					<div className="duration-grid">
						{[5, 10, 15, 20, 30].map((value) => (
							<button
								key={value}
								type="button"
								className={duration === value ? "active" : ""}
								onClick={() => handleDurationChange(value)}
							>
								{value} min
							</button>
						))}
					</div>
					<div className="metric">{formattedTime}</div>
					<ul className="session-history">
						{sessions.map((session) => (
							<li key={session.id}>
								<strong>{session.duration} min session</strong>
								<small>{formatSessionDate(session.createdAt)} • {session.cycles} cycles</small>
							</li>
						))}
						{sessions.length === 0 ? <li><small>No completed sessions yet.</small></li> : null}
					</ul>
				</Card>
			</section>

			<Card className="grounding-card" title="5-4-3-2-1 Grounding" subtitle="Reconnect with the present moment through sensory awareness.">
				<div className="grid-five">
					<button type="button" className={groundingChecks.see ? "active" : ""} onClick={() => toggleGroundingCheck("see")}><strong>5</strong> Things you see</button>
					<button type="button" className={groundingChecks.feel ? "active" : ""} onClick={() => toggleGroundingCheck("feel")}><strong>4</strong> Things you feel</button>
					<button type="button" className={groundingChecks.hear ? "active" : ""} onClick={() => toggleGroundingCheck("hear")}><strong>3</strong> Things you hear</button>
					<button type="button" className={groundingChecks.smell ? "active" : ""} onClick={() => toggleGroundingCheck("smell")}><strong>2</strong> Things you smell</button>
					<button type="button" className={groundingChecks.taste ? "active" : ""} onClick={() => toggleGroundingCheck("taste")}><strong>1</strong> Thing you taste</button>
				</div>
				<div className="grounding-footer">
					<p className="status-line">Completed: {groundingProgress.done}/{groundingProgress.total}</p>
					<button type="button" className="ghost-btn" onClick={clearGrounding}>Clear Checklist</button>
				</div>
			</Card>

			<h2 className="section-title">Recommended for You</h2>

			<section className="recommended-grid">
				<Card className="rec-card morning" title="Morning Clarity Flow" subtitle="15 min">
					<button type="button" onClick={() => handleRecommendedStart(15)}>Play</button>
				</Card>
				<Card className="rec-card nature" title="Nature Ambience Drift" subtitle="10 min">
					<button type="button" onClick={() => handleRecommendedStart(10)}>Play</button>
				</Card>
				<Card className="rec-card bowl" title="Quick Calm Recharge" subtitle="5 min">
					<button type="button" onClick={() => handleRecommendedStart(5)}>Play</button>
				</Card>
			</section>
		</main>
	);
}
